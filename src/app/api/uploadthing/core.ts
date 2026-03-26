import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getSession } from "@/lib/dal";

const f = createUploadthing();

const handleAuth = async () => {
  const session = await getSession();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return { userId: session.user.id };
};

export const ourFileRouter = {

  // 👤 USER AVATAR
  userAvatarUploader: f({
    image: { maxFileSize: "1MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      return await handleAuth();
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Avatar uploaded by:", metadata.userId);

      return {
        uploadedBy: metadata.userId,
        url: file.url,
      };
    }),

  // 🏗️ BRAND BANNER
  brandBannerUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      return await handleAuth();
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return {
        uploadedBy: metadata.userId,
        url: file.url,
      };
    }),

  // 🏢 ORG LOGO
  orgLogoUploader: f({
    image: { maxFileSize: "2MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      return await handleAuth();
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return {
        uploadedBy: metadata.userId,
        url: file.url,
      };
    }),

  // 🖼️ ORG BANNER
  orgBannerUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      return await handleAuth();
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return {
        uploadedBy: metadata.userId,
        url: file.url,
      };
    }),

  // 🚀 PROJECT LOGO
  projectLogoUploader: f({
    image: { maxFileSize: "2MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      return await handleAuth();
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return {
        uploadedBy: metadata.userId,
        url: file.url,
      };
    }),

  // 🖼️ PROJECT BANNER
  projectBannerUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      return await handleAuth();
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return {
        uploadedBy: metadata.userId,
        url: file.url,
      };
    }),

  // 🚀 PROJECT PITCH DECK
  projectPitchDeckUploader: f({
    pdf: { maxFileSize: "8MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      return await handleAuth();
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return {
        uploadedBy: metadata.userId,
        url: file.url,
      };
    }),

  // 💬 MESSAGE ATTACHMENT
  messageAttachmentUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 3 },
    pdf: { maxFileSize: "16MB", maxFileCount: 2 },
  })
    .middleware(async () => {
      return await handleAuth();
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return {
        uploadedBy: metadata.userId,
        url: file.url,
      };
    }),

  // 📧 PUBLIC MAIL ATTACHMENT
  publicMailAttachmentUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 5 },
    pdf: { maxFileSize: "8MB", maxFileCount: 5 },
    blob: { maxFileSize: "8MB", maxFileCount: 5 },
  })
    .middleware(async () => {
      // No auth required for public outreach
      return {};
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.url };
    }),

  // 📝 PROJECT UPDATE IMAGE
  projectUpdateUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      return await handleAuth();
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return {
        uploadedBy: metadata.userId,
        url: file.url,
      };
    }),

} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
