"use client";

import { useJobContext, JobFilters } from "./JobContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export function FiltersPanel() {
    const { filters, setFilters } = useJobContext();

    const updateFilter = (key: keyof JobFilters, value: string | string[]) => {
        setFilters({ ...filters, [key]: value });
    };

    const toggleSkill = (skill: string) => {
        const current = filters.skills;
        if (current.includes(skill)) {
            updateFilter("skills", current.filter((s: string) => s !== skill));
        } else {
            updateFilter("skills", [...current, skill]);
        }
    };

    return (
        <div className="border-t border-border bg-panel/30">
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="filters" className="border-none">
                    <AccordionTrigger className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-muted hover:no-underline flex-row-reverse justify-end gap-2">
                        Filters
                    </AccordionTrigger>
                    <AccordionContent className="px-2 pb-2 space-y-1">
                        <Accordion type="multiple" className="w-full">
                            {/* Authorization */}
                            <AccordionItem value="auth" className="border-none">
                                <AccordionTrigger className="py-2 text-sm hover:no-underline">Authorization</AccordionTrigger>
                                <AccordionContent>
                                    <div className="space-y-2">
                                        {[
                                            { id: "all", label: "Any status" },
                                            { id: "authorized", label: "Authorized only" },
                                            { id: "sponsorship", label: "Needs sponsorship" }
                                        ].map((opt) => (
                                            <div key={opt.id} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`auth-${opt.id}`}
                                                    checked={filters.authorized === opt.id}
                                                    onCheckedChange={() => updateFilter("authorized", opt.id)}
                                                />
                                                <Label htmlFor={`auth-${opt.id}`} className="text-sm font-normal text-text">{opt.label}</Label>
                                            </div>
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            {/* Location */}
                            <AccordionItem value="location" className="border-none">
                                <AccordionTrigger className="py-2 text-sm hover:no-underline">Location</AccordionTrigger>
                                <AccordionContent>
                                    <Input
                                        placeholder="e.g. San Francisco"
                                        value={filters.location}
                                        onChange={(e) => updateFilter("location", e.target.value)}
                                        className="h-8 text-sm"
                                    />
                                </AccordionContent>
                            </AccordionItem>

                            {/* Years of Experience */}
                            <AccordionItem value="yoe" className="border-none">
                                <AccordionTrigger className="py-2 text-sm hover:no-underline">Years of Experience</AccordionTrigger>
                                <AccordionContent>
                                    <Input
                                        type="number"
                                        placeholder="Min years (e.g. 5)"
                                        value={filters.yoe}
                                        onChange={(e) => updateFilter("yoe", e.target.value)}
                                        className="h-8 text-sm"
                                    />
                                </AccordionContent>
                            </AccordionItem>

                            {/* Skills */}
                            <AccordionItem value="skills" className="border-none">
                                <AccordionTrigger className="py-2 text-sm hover:no-underline">Must-have Skills</AccordionTrigger>
                                <AccordionContent>
                                    <div className="space-y-2">
                                        <Input
                                            placeholder="Add skill + Enter"
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    const val = e.currentTarget.value.trim();
                                                    if (val && !filters.skills.includes(val)) {
                                                        toggleSkill(val);
                                                        e.currentTarget.value = "";
                                                    }
                                                }
                                            }}
                                            className="h-8 text-sm"
                                        />
                                        <div className="flex flex-wrap gap-1.5">
                                            {filters.skills.map((skill: string) => (
                                                <Badge key={skill} variant="secondary" className="text-xs font-normal gap-1 hover:bg-muted/20">
                                                    {skill}
                                                    <X size={10} className="cursor-pointer" onClick={() => toggleSkill(skill)} />
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}
