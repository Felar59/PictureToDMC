import { Link } from "react-router-dom"

import { BrandMark } from "@/components/brand/logo"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/i18n"

export default function NotFound() {
  const { t } = useI18n()

  return (
    <div className="mx-auto max-w-[640px] px-5 py-24 text-center flex flex-col items-center gap-5">
      <BrandMark size={104} />
      <h1 className="text-[32px] sm:text-[38px] m-0">{t.notFound.title}</h1>
      <p className="text-[17px] text-clay m-0">{t.notFound.body}</p>
      <Button asChild>
        <Link to="/">{t.notFound.home}</Link>
      </Button>
    </div>
  )
}
