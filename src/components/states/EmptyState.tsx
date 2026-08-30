import * as React from "react";
import { StateShell, type StateAction } from "./StateShell";
export function EmptyState(props: { icon?: React.ReactNode; title: React.ReactNode; description?: React.ReactNode; actions?: StateAction[] }) { return <StateShell {...props} />; }
