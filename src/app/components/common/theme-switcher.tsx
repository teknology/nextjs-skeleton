import { useEffect, useState } from "react";
import { Switch, Skeleton } from "@nextui-org/react";
import { MoonIcon, SunIcon } from "@/app/components/icons"
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";
import * as actions from "@/actions";

export default function ThemeSwitch() {
    const session = useSession();
    const { theme, setTheme } = useTheme();
    const [loading, setLoading] = useState(true); // Track loading state
    const userId = session?.data?.user?.id ?? null; // Assume user ID is available (e.g., from authentication)
    // Fetch the theme from the action file on component mount
    useEffect(() => {
        const fetchTheme = async () => {
            try {
                const savedTheme = await actions.getThemefromDBAction();
                setTheme(savedTheme || "light"); // Default to light if no theme found
            } catch (error) {
                console.error("Error fetching theme:", error);
                setTheme("light"); // Fallback to light on error
            } finally {
                setLoading(false); // Stop loading when theme is set
            }
        };

        fetchTheme();
    }, [setTheme, userId]);

    // Handle the switch toggle and save the theme
    const handleThemeChange = async (isSelected: boolean) => {
        const newTheme = isSelected ? "dark" : "light";
        setTheme(newTheme);
        await actions.setThemeinDBAction(newTheme);  // Save theme to the database
    };

    // Show a skeleton loader while fetching the theme
    if (loading) {
        return (
            <div className="h-2">
                <Skeleton className="w-full h-full" />
            </div>
        );
    }

    return (
        <Switch
            checked={theme === "dark"}
            size="md"
            color="default"
            onChange={(e) => handleThemeChange(e.target.checked)}
            thumbIcon={({ isSelected, className }) =>
                isSelected ? <SunIcon className={className} /> : <MoonIcon className={className} />
            }
        >
        </Switch>
    );
}