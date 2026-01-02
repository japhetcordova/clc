import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MINISTRIES, NETWORKS, CLUSTERS } from "@/lib/church-data";
import { cn } from "@/lib/utils";

interface SelectProps {
    value?: string;
    onValueChange: (v: string) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

export function MinistrySelect({ value, onValueChange, placeholder = "Select ministry", className, disabled }: SelectProps) {
    return (
        <Select value={value} onValueChange={onValueChange} disabled={disabled}>
            <SelectTrigger className={cn("h-12 bg-background/50 border-border text-foreground rounded-xl", className)}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border text-popover-foreground">
                {MINISTRIES.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

export function ClusterSelect({ value, onValueChange, placeholder = "Select Cluster", className, disabled }: SelectProps) {
    return (
        <Select value={value} onValueChange={onValueChange} disabled={disabled}>
            <SelectTrigger className={cn("h-12 bg-background/50 border-border text-foreground rounded-xl", className)}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border text-popover-foreground">
                {CLUSTERS.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

interface NetworkSelectProps extends SelectProps {
    cluster: string;
    gender: string;
}

export function NetworkSelect({ cluster, gender, value, onValueChange, placeholder = "Select network", className, disabled }: NetworkSelectProps) {
    const networks = (cluster && gender) ? (NETWORKS as any)[cluster]?.[gender] || [] : [];

    return (
        <Select value={value} onValueChange={onValueChange} disabled={disabled || !cluster}>
            <SelectTrigger className={cn("h-12 bg-background/50 border-border text-foreground rounded-xl", className)}>
                <SelectValue placeholder={cluster ? placeholder : "Choose cluster first"} />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border text-popover-foreground">
                {networks.map((n: string) => (
                    <SelectItem key={n} value={n}>{n}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
