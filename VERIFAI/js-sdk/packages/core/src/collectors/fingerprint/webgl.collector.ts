export class WebGLCollector {
    collect() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl');

            if (!gl) {
                return null;
            }

            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');

            if (!debugInfo) {
                return {
                    vendor: null,
                    renderer: null
                };
            }

            return {
                vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) as string | null,
                renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string | null
            };
        } catch {
            return null;
        }
    }

    collectDetails() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl');

            if (!gl) {
                return null;
            }

            return {
                maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE) as number,
                maxViewportDims: gl.getParameter(gl.MAX_VIEWPORT_DIMS) as number[],
                shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION) as string | null
            };
        } catch {
            return null;
        }
    }
}
