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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CustomPagination } from "@/components/Common/CustomPagination/CustomPagination";
import { RefreshCw, Headphones, BookOpen, PenTool, Mic, Trash2 } from "lucide-react";
import {
  useGetPoolStatusQuery,
  useGeneratePoolContentMutation,
  useGetSkillTestsQuery,
  useDeleteSkillTestMutation,
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
  const [activeTab, setActiveTab] = useState<Skill>("IELTS_READING");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [deleteTarget, setDeleteTarget] = useState<{ skill: Skill; id: string; title: string } | null>(
    null
  );

  const { data: testsData, isFetching: isFetchingTests } = useGetSkillTestsQuery({
    skill: activeTab,
    page,
    limit,
  });
  const [deleteSkillTest, { isLoading: isDeleting }] = useDeleteSkillTestMutation();

  const handleTabChange = (value: string) => {
    setActiveTab(value as Skill);
    setPage(1);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteSkillTest({ skill: deleteTarget.skill, id: deleteTarget.id }).unwrap();
      toast.success("Test deleted");
    } catch (error: any) {
      console.error("Failed to delete test:", error);
      toast.error(error?.data?.message || "Failed to delete test.");
    } finally {
      setDeleteTarget(null);
    }
  };

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
          AI-generated IELTS tests are no longer topped up automatically — generate content here
          manually as needed, and delete tests you no longer want to keep.
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
          <CardTitle>Manage Tests</CardTitle>
          <CardDescription>Browse and delete individual generated tests</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="mb-4">
              {SKILLS.map(({ skill, label }) => (
                <TabsTrigger key={skill} value={skill}>
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>

            {SKILLS.map(({ skill }) => (
              <TabsContent key={skill} value={skill} className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Difficulty</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isFetchingTests ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8">
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (testsData?.data ?? []).length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          No tests generated yet for this skill.
                        </TableCell>
                      </TableRow>
                    ) : (
                      testsData.data.map((test: any) => (
                        <TableRow key={test.id}>
                          <TableCell className="max-w-md truncate">{test.title}</TableCell>
                          <TableCell>{test.difficulty}</TableCell>
                          <TableCell className="text-muted-foreground text-xs">
                            {format(new Date(test.createdAt), "MMM dd, yyyy HH:mm")}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-destructive hover:text-destructive"
                              onClick={() => setDeleteTarget({ skill, id: test.id, title: test.title })}
                              title="Delete test"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>

                {testsData?.meta && testsData.meta.total > 0 && (
                  <CustomPagination
                    meta={testsData.meta}
                    onPageChange={setPage}
                    onLimitChange={(newLimit) => {
                      setLimit(newLimit);
                      setPage(1);
                    }}
                  />
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

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

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this test?</AlertDialogTitle>
            <AlertDialogDescription>
              &quot;{deleteTarget?.title}&quot; will be permanently deleted. This can&apos;t be undone.
              If any user has already started a session with this test, deletion will be blocked.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ContentPoolPage;
