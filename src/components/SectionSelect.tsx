import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import type { Section } from "@/types/Textbook";

interface SectionSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  sections: Section[];
  placeholder?: string;
}

export function SectionSelect({ value, onValueChange, sections, placeholder = "Select section..." }: SectionSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {sections.map((section) => (
          <SelectItem key={section.id} value={section.id?.toString?.() ?? section.num?.toString?.() ?? ''}>
            Section {section.num}: {section.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
} 