export enum Colors {
  PRIMARY = 1,
  SECONDARY = 2,
  SUCCESS = 3,
  DANGER = 4,
  WARNING = 5,
}

export function colorsToName(color: Colors) {
  switch (color) {
    case Colors.PRIMARY:
      return "primary";
    case Colors.SECONDARY:
      return "secondary";
    case Colors.SUCCESS:
      return "success";
    case Colors.DANGER:
      return "danger";
    case Colors.WARNING:
      return "warning";
  }
}

export const APIVersion = "1";