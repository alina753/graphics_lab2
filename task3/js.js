new Vue({
  el: "#app",
  data: {
    ctx: null,
    imageData: null,
    copyImageData: null,
    hsv: [],

    h: 0,
    s: 0,
    v: 0
  },

  mounted() {
    this.ctx = document.getElementById('canvas').getContext('2d');
  },
  methods: {
    loadImage(e){
      let img = new Image;
      this.ctx.clearRect(0, 0, 500, 500);
      img.onload = ()=> {
          let w = img.width;
          let h = img.height;

          let canvas = document.getElementById('canvas');
          canvas.width = w;
          canvas.height = h;

          this.ctx.drawImage(img, 0, 0);
          this.imageData = this.ctx.getImageData(0, 0, 500, 500);
      }
      img.src = URL.createObjectURL(e.target.files[0]);
    },

    changeHue(e){
      this.h = e.target.value;
      this.createNewImage();
    },

    changeSat(e){
      this.s = Number(e.target.value);
      this.createNewImage();
    },

    changeVal(e){
      this.v = Number(e.target.value);
      this.createNewImage();
    },

    createNewImage(){
      this.copyImageData = structuredClone(this.imageData);
      this.ctx.clearRect(0, 0, 1000, 1000);
      this.rgbToHsv();
      this.hsvToRgb();
      this.ctx.putImageData(this.copyImageData, 0, 0);
    },

    rgbToHsv(){
      this.hsv = [];
      for(let i = 0; i < this.imageData.data.length; i += 4){
        let r1 = this.imageData.data[i] / 255 ;
        let g1 = this.imageData.data[i + 1] / 255;
        let b1 = this.imageData.data[i + 2] / 255;

        let cmax = Math.max(r1, g1, b1);
        let cmin = Math.min(r1, g1, b1);
        let delta = cmax - cmin;

        let h = 0;
        let s = 0;
        let v = 0;

        //h
        switch(cmax){
          case r1:
            h = (this.h + 60 *( ((g1 - b1)/delta) % 6 )) % 360;
            break;
          case g1:
            h =  (this.h + 60 *( ((b1 - r1)/delta) + 2 )) % 360;
            break;
          case b1:
            h = (this.h + 60 *( ((r1 - g1)/delta) + 4 )) % 360;
            break;
            default:
              h = 0;
        }

        //s
        switch(cmax){
          case 0:
            s = this.s;
            break;
          default: 
            s = this.s + (delta / cmax);
        }

        //v
        v = this.v + cmax;

        this.hsv.push(h, s, v, 0);       
      }    
    },

    hsvToRgb(){
        for(let i = 0; i < this.hsv.length; i += 4){
          let h = this.hsv[i];
          let s = this.hsv[i + 1];
          let v = this.hsv[i + 2];

          let c = v * s;
          let x = c * (1 - Math.abs( ((h/60) % 2) - 1));
          let m = v - c;
          
          let r1 = 0;
          let g1 = 0;
          let b1 = 0;

          if(h >= 0 && h < 60){
            r1 = c;
            g1 = x;
            b1 = 0;
          }
          else if(h >= 60 && h < 120){
            r1 = x;
            g1 = c;
            b1 = 0;
          }
          else if(h >= 120 && h < 180){
            r1 = 0;
            g1 = c;
            b1 = x;
          }
          else if(h >= 180 && h < 240){
            r1 = 0;
            g1 = x;
            b1 = c;
          }
          else if(h >= 240 && h < 300){
            r1 = x;
            g1 = 0;
            b1 = c;
          }
          else if(h >= 300 && h < 360){
            r1 = c;
            g1 = 0;
            b1 = x;
          }

          let r = (r1 + m) * 255;
          let g = (g1 + m) * 255;
          let b = (b1 + m) * 255;

          this.copyImageData.data[i] = r;
          this.copyImageData.data[i + 1] = g;
          this.copyImageData.data[i + 2] = b;
        }
    }
  }
});
