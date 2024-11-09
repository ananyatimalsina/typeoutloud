{ pkgs ? import <nixpkgs> { } }:

pkgs.mkShell {
	nativeBuildInputs = with pkgs; [
		nodejs
		pkg-config
		webkitgtk
		llvm_18
		alsa-lib
		cmakeMinimal
		espeak
        # Common plugins like "filesrc" to combine within e.g. gst-launch
        gst_all_1.gst-plugins-base
        # Specialized plugins separated by quality
        gst_all_1.gst-plugins-good
        gst_all_1.gst-plugins-bad
        gst_all_1.gst-plugins-ugly
	];
	buildInputs = [ pkgs.cargo pkgs.rustc ];
	LIBCLANG_PATH = "${pkgs.llvmPackages_18.libclang.lib}/lib";
	WEBKIT_DISABLE_COMPOSITING_MODE=1;
	SONATA_ESPEAKNG_DATA_DIRECTORY = "${pkgs.espeak}/share";
}
