import { useCallback, useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"

import { AdminFlower } from "@/community/admin-flower"
import { GalleryCard } from "@/community/gallery-card"
import { useAuth } from "@/community/auth-context"
import { StitchAvatar } from "@/components/brand/stitch-avatar"
import { Button } from "@/components/ui/button"
import { Tag } from "@/components/ui/pill"
import { useI18n } from "@/i18n"
import * as api from "@/lib/community"

type Profile = {
  user: api.PublicUser
  joinedAt: number
  posts: api.PostCard[]
  totalLikes: number
}

/** A member and their pieces. */
export default function ProfilePage() {
  const { t, lang } = useI18n()
  const { user, signIn } = useAuth()
  const { id } = useParams()
  const userId = Number(id)

  const [profile, setProfile] = useState<Profile | null>(null)
  const [state, setState] = useState<"loading" | "ready" | "failed">("loading")

  const load = useCallback(() => {
    setState("loading")
    fetch(`/api/users/${userId}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((p: Profile) => {
        setProfile(p)
        setState("ready")
      })
      .catch(() => setState("failed"))
  }, [userId])

  useEffect(load, [load])

  const like = async (postId: number) => {
    if (!user) return signIn(`/brodeur/${userId}`)
    setProfile((p) =>
      p
        ? {
            ...p,
            posts: p.posts.map((x) =>
              x.id === postId
                ? { ...x, liked: !x.liked, likeCount: x.likeCount + (x.liked ? -1 : 1) }
                : x,
            ),
          }
        : p,
    )
    await api.toggleLike(postId).catch(load)
  }

  const remove = async (postId: number) => {
    // Deleting someone else's is only possible for an admin, and says so: the
    // prompt on this page would otherwise be the same words whether you were
    // tidying your own gallery or someone's.
    const isMine = user?.id === userId
    if (!window.confirm(isMine ? t.gallery.confirmDelete : t.gallery.confirmDeleteOther)) return
    setProfile((p) => (p ? { ...p, posts: p.posts.filter((x) => x.id !== postId) } : p))
    await api.deletePost(postId).catch(load)
  }

  if (state === "loading") {
    return <p className="text-center text-cocoa py-24">{t.gallery.loading}</p>
  }
  if (state === "failed" || !profile) {
    return (
      <div className="text-center py-24 flex flex-col items-center gap-4">
        <p className="text-coral-deeper m-0">{t.profile.notFound}</p>
        <Button asChild variant="secondary">
          <Link to="/gallery">{t.piece.backToGallery}</Link>
        </Button>
      </div>
    )
  }

  const joined = new Date(profile.joinedAt).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", {
    month: "long",
    year: "numeric",
  })
  const isMe = user?.id === profile.user.id

  return (
    <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-20 py-10">
      <header className="flex items-center gap-5 flex-wrap pb-8 border-b-2 border-dashed border-edge-2">
        <StitchAvatar
          seed={profile.user.icon ?? profile.user.id}
          size={80}
          className="shadow-soft"
        />
        <div className="flex-1 min-w-[200px]">
          {/* Here the badge says the word: this page exists to answer "who is
              this", and there is room beside a 34px name for the answer. */}
          <h1 className="text-[30px] sm:text-[34px] m-0 flex items-center gap-3 flex-wrap">
            {profile.user.displayName}
            {profile.user.isAdmin && <AdminFlower variant="pill" />}
          </h1>
          <p className="text-[14.5px] text-stone m-0 mt-1">{t.profile.joined(joined)}</p>
          {/* Their own words, if they wrote any. whitespace-pre-line so a bio
              written in two lines stays two lines. */}
          {profile.user.bio && (
            <p className="text-[15.5px] text-clay m-0 mt-2.5 max-w-[62ch] leading-[1.55] whitespace-pre-line break-words">
              {profile.user.bio}
            </p>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          <Tag>{t.profile.pieces(profile.posts.length)}</Tag>
          <Tag>{t.profile.likes(profile.totalLikes)}</Tag>
        </div>
      </header>

      {profile.posts.length === 0 ? (
        <div className="text-center py-16 flex flex-col items-center gap-4">
          <p className="text-cocoa m-0">
            {isMe ? t.profile.emptyMine : t.profile.emptyTheirs(profile.user.displayName)}
          </p>
          {isMe && (
            <Button asChild>
              <Link to="/convert">{t.gallery.shareCta}</Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
          {profile.posts.map((post) => (
            <GalleryCard
              key={post.id}
              post={post}
              onLike={like}
              onDelete={isMe || user?.isAdmin ? remove : undefined}
            />
          ))}
        </div>
      )}
    </div>
  )
}
