import { Position } from "./Position";

export type Harbor = {
  id: string;
  type: string;
  name: string;
  positionType: string;
  position: Position;
};
