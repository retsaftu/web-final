// src/components/videos/VideoPlayer.tsx
import React from "react";
import { useParams } from "react-router-dom";
import { useVideoStore } from "@/store/videoStore";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PlayCircle, Clock, HardDrive, Check, ChevronUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const VideoPlayer = () => {
  const { dealId } = useParams<{ dealId: string }>();
  const {
    videos,
    currentVideo,
    isLoading,
    error,
    fetchVideos,
    setActiveVideo,
    setCurrentVideo,
  } = useVideoStore();

  React.useEffect(() => {
    if (dealId) {
      fetchVideos(dealId);
    }
  }, [dealId, fetchVideos]);

  const handleSetActive = async () => {
    if (!dealId || !currentVideo) return;
    await setActiveVideo(dealId, currentVideo.name);
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <Card className="p-4 border-destructive">
        <p className="text-destructive">{error}</p>
      </Card>
    );
  }

  const VideoList = () => (
    <div className="space-y-4">
      {videos.map((video) => (
        <Card
          key={video.name}
          className={cn(
            "p-4 cursor-pointer transition-all hover:shadow-lg border",
            currentVideo?.name === video.name &&
              "ring-2 ring-primary border-primary",
            video.is_active && "bg-primary/5"
          )}
          onClick={() => setCurrentVideo(video)}
        >
          <div className="flex items-start gap-3">
            <PlayCircle className="w-5 h-5 mt-1 flex-shrink-0 text-primary" />
            <div className="space-y-2 flex-1 min-w-0">
              <p className="font-medium truncate">{video.filename}</p>
              <div className="text-sm text-muted-foreground space-y-1.5">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="truncate">
                    Загружено: {video.last_modified}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4" />
                  <span className="truncate">Размер: {video.size}</span>
                </div>
              </div>
              {video.is_active && (
                <div className="flex items-center gap-2 text-primary mt-2">
                  <Check className="w-4 h-4" />
                  <span className="text-sm font-medium">Активное</span>
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const VideoPlayer = () => (
    <Card className="flex-1 min-h-0">
      <div className="h-full p-6 flex flex-col">
        {currentVideo ? (
          <>
            <div className="relative flex-1 min-h-0 mb-4">
              <video
                key={currentVideo.url}
                src={currentVideo.url}
                controls
                className="absolute inset-0 w-full h-full rounded-lg object-contain bg-black/5"
              />
            </div>
            <Button
              onClick={handleSetActive}
              disabled={currentVideo.is_active}
              className="w-full"
              size="lg"
            >
              {currentVideo.is_active ? "Активное видео" : "Сделать активным"}
            </Button>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <PlayCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>Выберите видео для просмотра</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );

  // Десктопная версия
  const DesktopLayout = () => (
    <div className="hidden lg:flex gap-6 h-[calc(100vh-8rem)]">
      <Card className="w-96 flex-shrink-0 overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">Список видео</h2>
          <span className="text-sm text-muted-foreground">
            Всего: {videos.length}
          </span>
        </div>
        <ScrollArea className="h-[calc(100%-4rem)]">
          <div className="p-4">
            <VideoList />
          </div>
        </ScrollArea>
      </Card>
      <VideoPlayer />
    </div>
  );

  // Мобильная версия
  const MobileLayout = () => (
    <div className="lg:hidden flex flex-col h-[calc(100vh-8rem)]">
      <VideoPlayer />
      <div className="mt-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="w-full flex items-center gap-2"
            >
              <ChevronUp className="w-4 h-4" />
              Список видео ({videos.length})
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh]">
            <div className="h-full pt-4">
              <ScrollArea className="h-full">
                <VideoList />
              </ScrollArea>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );

  return (
    <>
      <MobileLayout />
      <DesktopLayout />
    </>
  );
};

const LoadingSkeleton = () => (
  <div className="flex gap-6 h-[calc(100vh-8rem)]">
    <Card className="w-96 flex-shrink-0">
      <div className="p-4 border-b">
        <Skeleton className="h-6 w-32" />
      </div>
      <div className="p-4 space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-24 w-full" />
          </Card>
        ))}
      </div>
    </Card>
    <Card className="flex-1">
      <div className="p-6">
        <Skeleton className="h-full w-full" />
      </div>
    </Card>
  </div>
);
