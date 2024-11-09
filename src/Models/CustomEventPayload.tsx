interface CustomEventPayload {
  action: "play" | "pause" | "recovery" | "volume";
  file_path?: string;
  volume?: number;
}

export default CustomEventPayload;
