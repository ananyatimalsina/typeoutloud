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
	];
	buildInputs = [ pkgs.cargo pkgs.rustc ];
	LIBCLANG_PATH = "${pkgs.llvmPackages_18.libclang.lib}/lib";
	WEBKIT_DISABLE_COMPOSITING_MODE=1;
	SONATA_ESPEAKNG_DATA_DIRECTORY = "${pkgs.espeak}/share";
}
