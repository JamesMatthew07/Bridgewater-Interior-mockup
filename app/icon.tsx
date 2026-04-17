import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const size = {
  width: 256,
  height: 256,
};

export const contentType = "image/png";

export default async function Icon() {
  const logoBuffer = await readFile(
    path.join(process.cwd(), "public", "bridgewater-logo-white.png"),
  );
  const logoDataUrl = `data:image/png;base64,${logoBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "56px",
          background: "linear-gradient(135deg, #183b5a 0%, #102c45 100%)",
          padding: "34px",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundImage: `url(${logoDataUrl})`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
          }}
        />
      </div>
    ),
    size,
  );
}
