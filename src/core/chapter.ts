import Stage from "./stage"

export default interface Chapter {
  stage: Stage
  onBeforeRender: (time: number) => void
}
