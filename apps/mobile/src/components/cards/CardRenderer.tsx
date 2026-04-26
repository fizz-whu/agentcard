import React from "react";
import type { CardFields } from "@agentcard/shared";
import { CardClassic } from "./CardClassic";
import { CardDark } from "./CardDark";
import { CardMinimal } from "./CardMinimal";

interface Props {
  templateId: string;
  fields: CardFields;
}

export function CardRenderer({ templateId, fields }: Props) {
  if (templateId === "dark") return <CardDark fields={fields} />;
  if (templateId === "minimal") return <CardMinimal fields={fields} />;
  return <CardClassic fields={fields} />;
}
