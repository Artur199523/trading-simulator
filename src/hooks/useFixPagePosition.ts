import { useEffect } from "react"

export const useFixPagePosition = (isFix: boolean) => {
    useEffect(() => {
        if (isFix) {
            document.body.style.overflow = "hidden"
        }

        return () => {
            document.body.style.overflow = "unset"
        }
    }, [isFix])
}