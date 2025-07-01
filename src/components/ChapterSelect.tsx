import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import type { Chapter } from "@/types/Textbook";

interface ChapterSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  chapters: Chapter[];
  placeholder?: string;
}

export function ChapterSelect({ value, onValueChange, chapters, placeholder = "Select chapter..." }: ChapterSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {chapters.map((chapter) => (
          <SelectItem key={chapter.id} value={chapter.id?.toString?.() ?? chapter.num?.toString?.() ?? ''}>
            Chapter {chapter.num}: {chapter.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
} 