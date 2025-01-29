import { Stage } from "./stager"

export default interface Chapter {
  stage: Stage
  onRender: (time: number) => void
}
