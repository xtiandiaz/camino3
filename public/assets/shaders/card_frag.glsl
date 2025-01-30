varying vec2 vUv;

uniform sampler2D front_texture;
uniform sampler2D back_texture;

void main() {
  vec4 texel;
  
  if (gl_FrontFacing) {
    texel = texture2D(front_texture, vUv);
  } else {
    texel = texture2D(back_texture, vUv);
  }
  
  gl_FragColor = texel;
}
