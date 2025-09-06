"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IListeningAudio } from "@/types";

interface ListenAudioModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  audio: IListeningAudio | null;
}

export const ListenAudioModal = ({
  open,
  onOpenChange,
  audio,
}: ListenAudioModalProps) => {
  if (!audio) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{audio.title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <audio controls src={audio.audioUrl} className="w-full">
            Your browser does not support the audio element.
          </audio>
          <div className="rounded-md border p-4 max-h-[300px] overflow-y-auto">
            <h4 className="text-lg font-semibold mb-2">Transcript</h4>
            <p className="text-sm text-muted-foreground">{audio.transcript}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
