import { Avatar, AvatarImage } from "@/components/ui/avatar";

export default function SocialProofUsers() {
  return (
    <div className="items-center flex gap-3">
      <div className="flex">
        <Avatar className="border-2 border-white">
          <AvatarImage
            alt="@john"
            src="https://wqnmyfkavrotpmupbtou.supabase.co/storage/v1/object/public/assets/sections-assets/testimonial-1.avif"
          />
        </Avatar>
        <Avatar className="border-2 border-white -ml-4">
          <AvatarImage
            alt="@max"
            src="https://wqnmyfkavrotpmupbtou.supabase.co/storage/v1/object/public/assets/sections-assets/testimonial-2.avif"
          />
        </Avatar>
        <Avatar className="border-2 border-white -ml-4">
          <AvatarImage
            alt="@bob"
            src="https://wqnmyfkavrotpmupbtou.supabase.co/storage/v1/object/public/assets/sections-assets/testimonial-3.avif"
          />
        </Avatar>
        <Avatar className="border-2 border-white -ml-4">
          <AvatarImage
            alt="@emily"
            src="https://wqnmyfkavrotpmupbtou.supabase.co/storage/v1/object/public/assets/sections-assets/testimonial-4.avif"
          />
        </Avatar>
        <Avatar className="border-2 border-white -ml-4">
          <AvatarImage
            alt="@michael"
            src="https://wqnmyfkavrotpmupbtou.supabase.co/storage/v1/object/public/assets/sections-assets/testimonial-5.avif"
          />
        </Avatar>
      </div>
      <div>
        <div className="flex items-center">
          <svg
            fill="none"
            width="20"
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            stroke="currentColor"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polygon
              fill="currentColor"
              points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
              className="text-yellow-500"
            />
          </svg>
          <svg
            fill="none"
            width="20"
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            stroke="currentColor"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polygon
              fill="currentColor"
              points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
              className="text-yellow-500"
            />
          </svg>
          <svg
            fill="none"
            width="20"
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            stroke="currentColor"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polygon
              fill="currentColor"
              points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
              className="text-yellow-500"
            />
          </svg>
          <svg
            fill="none"
            width="20"
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            stroke="currentColor"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polygon
              fill="currentColor"
              points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
              className="text-yellow-500"
            />
          </svg>
          <svg
            fill="none"
            width="20"
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            stroke="currentColor"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polygon
              fill="currentColor"
              points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
              className="text-yellow-500"
            />
          </svg>
        </div>
        <span className="mt-1 text-sm font-semibold text-muted-foreground">
          Join
          <span className="text-foreground">1000+</span>
          carriers
        </span>
      </div>
    </div>
  );
}
