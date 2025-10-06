'use client';

export const CheckEmailVisual = () => {
  return (
    <div className="relative h-[300px] w-full max-w-md bg-gradient-to-br from-primary/20 via-primary/10 to-background rounded-lg flex items-center justify-center">
      <div className="absolute inset-0 overflow-hidden rounded-lg">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      <div className="relative z-10 text-center space-y-2 p-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted/50">
          <span className="text-muted-foreground">@</span>
        </div>
      </div>
    </div>
  );
};


