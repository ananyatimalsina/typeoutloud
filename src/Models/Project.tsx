import AudioConfig from "./AudioConfig";

interface Project {
  title: string;
  text: string;
  audios: string[];
  settings: AudioConfig;
  path: string;
}

export default Project;
