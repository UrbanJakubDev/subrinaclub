import { SelectOption } from "@/types/types";
import { bonusService } from "@/lib/services/bonus";

export async function getBonusesForSelect(): Promise<SelectOption[]> {
  return bonusService.getBonusesForSelect();
}
