interface TranscriptionBoxProps {
  transcript: string;
  interimTranscript: string;
  isRecording: boolean;
}

export function TranscriptionBox({
  transcript,
  interimTranscript,
  isRecording,
}: TranscriptionBoxProps) {
  const displayText = transcript + interimTranscript;

  return (
    <div className="px-4 lg:px-6 pb-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-dark-secondary border border-dark-tertiary rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-text-muted font-medium">
              LIVE TRANSCRIPTION
            </span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-xs text-text-muted">Recording</span>
            </div>
          </div>
          <div
            className="text-text-primary font-medium min-h-[24px]"
            data-testid="text-transcription"
          >
            {displayText || (
              <span className="typing-indicator">Listening...</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
