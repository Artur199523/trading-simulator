import { useEffect } from "react"

export const useFixPagePosition = (isFix: boolean) => {
    useEffect(() => {
        if (isFix) {
            document.body.style.position = "fixed"
        }

        return () => {
            document.body.style.position = "relative"
        }
    }, [isFix])
}