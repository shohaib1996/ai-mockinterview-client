"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RefreshCw, Headphones, BookOpen, PenTool, Mic } from "lucide-react";
import {
  useGetPoolStatusQuery,
  useGeneratePoolContentMutation,
} from "@/redux/api/content-pool/contentPoolApi";
import { format } from "date-fns";

type Skill = "IELTS_READING" | "IELTS_LISTENING" | "IELTS_WRITING" | "IELTS_SPEAKING";
type Difficulty = "LOW" | "MEDIUM" | "HIGH";

const SKILLS: { skill: Skill; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { skill: "IELTS_READING", label: "Reading", icon: BookOpen },
  { skill: "IELTS_LISTENING", label: "Listening", icon: Headphones },
  { skill: "IELTS_WRITING", label: "Writing", icon: PenTool },
  { skill: "IELTS_SPEAKING", label: "Speaking", icon: Mic },
];

const DIFFICULTIES: Difficulty[] = ["LOW", "MEDIUM", "HIGH"];

const ContentPoolPage = () => {
  const { data, isLoading } = useGetPoolStatusQuery({});
  const [generatePoolContent] = useGeneratePoolContentMutation();
  const [selectedDifficulty, setSelectedDifficulty] = useState<Record<Skill, Difficulty>>({
    IELTS_READING: "MEDIUM",
    IELTS_LISTENING: "MEDIUM",
    IELTS_WRITING: "MEDIUM",
    IELTS_SPEAKING: "MEDIUM",
  });
  const [generatingSkill, setGeneratingSkill] = useState<Skill | null>(null);

  const countsFor = (skill: Skill): Record<Difficulty, number> => {
    const key =
      skill === "IELTS_READING"
        ? "reading"
        : skill === "IELTS_LISTENING"
          ? "listening"
          : skill === "IELTS_WRITING"
            ? "writing"
            : "speaking";
    const rows = (data?.data?.[key] ?? []) as { difficulty: Difficulty; count: number }[];
    const result: Record<Difficulty, number> = { LOW: 0, MEDIUM: 0, HIGH: 0 };
    rows.forEach((r) => {
      result[r.difficulty] = (result[r.difficulty] ?? 0) + r.count;
    });
    return result;
  };

  const handleGenerate = async (skill: Skill) => {
    setGeneratingSkill(skill);
    try {
      const res = await generatePoolContent({
        skill,
        difficulty: selectedDifficulty[skill],
      }).unwrap();
      toast.success(
        res.data?.generated
          ? `Generated ${res.data.generated} new ${selectedDifficulty[skill].toLowerCase()} test(s)`
          : "Pool is already sufficient at this difficulty"
      );
    } catch (error) {
      console.error("Failed to trigger generation:", error);
      toast.error("Failed to trigger generation.");
    } finally {
      setGeneratingSkill(null);
    }
  };

  const recentLogs = data?.data?.recentLogs ?? [];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Content Pool</h1>
        <p className="text-muted-foreground">
          AI-generated IELTS tests are topped up automatically every 6 hours. Use this page to
          check pool health or force a top-up manually.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {SKILLS.map(({ skill, label, icon: Icon }) => {
            const counts = countsFor(skill);
            return (
              <Card key={skill}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Icon className="h-5 w-5" />
                    {label}
                  </CardTitle>
                  <CardDescription>Tests available per difficulty</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-2 text-center text-sm">
                    {DIFFICULTIES.map((d) => (
                      <div key={d} className="p-2 bg-muted rounded-lg">
                        <p className="text-muted-foreground text-xs">{d}</p>
                        <p className="text-xl font-semibold">{counts[d]}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Select
                      value={selectedDifficulty[skill]}
                      onValueChange={(value) =>
                        setSelectedDifficulty((prev) => ({ ...prev, [skill]: value as Difficulty }))
                      }
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DIFFICULTIES.map((d) => (
                          <SelectItem key={d} value={d}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleGenerate(skill)}
                      disabled={generatingSkill === skill}
                      title="Generate now"
                    >
                      <RefreshCw
                        className={`h-4 w-4 ${generatingSkill === skill ? "animate-spin" : ""}`}
                      />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Recent Generation Activity</CardTitle>
          <CardDescription>Last 20 automated or manual generation attempts</CardDescription>
        </CardHeader>
        <CardContent>
          {recentLogs.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              No generation activity yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Skill</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Error</TableHead>
                  <TableHead>When</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentLogs.map((log: any) => (
                  <TableRow key={log.id}>
                    <TableCell>{log.skill.replace(/_/g, " ")}</TableCell>
                    <TableCell>{log.difficulty}</TableCell>
                    <TableCell>
                      <Badge variant={log.status === "SUCCESS" ? "default" : "destructive"}>
                        {log.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground text-xs">
                      {log.errorMessage || "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {format(new Date(log.createdAt), "MMM dd, yyyy HH:mm")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentPoolPage;
