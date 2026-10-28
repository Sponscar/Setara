/**
 * @file ParticleSlider.js
 * @description ParticleSlider engine based on Tamino Martinius ParticleSlider
 * Adapted for modern ES6 React integration with accurate bounding rect & cleanup.
 */

function psParticle(ps) {
  this.ps = ps;
  this.ttl = null;
  this.color = ps.colorArr;
  this.next = null;
  this.prev = null;
  this.gravityX = 0;
  this.gravityY = 0;
  this.x = Math.random() * (ps.cw || 400);
  this.y = Math.random() * (ps.ch || 400);
  this.velocityX = Math.random() * 10 - 5;
  this.velocityY = Math.random() * 10 - 5;
}

psParticle.prototype.move = function () {
  var ps = this.ps;
  if (this.ttl != null && this.ttl-- <= 0) {
    ps.swapList(this, ps.pxlBuffer, ps.recycleBuffer);
    this.ttl = null;
  } else {
    var dx = this.gravityX + ps.swipeOffset - this.x;
    var dy = this.gravityY - this.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    var angle = Math.atan2(dy, dx);
    var accel = dist * 0.01;

    if (ps.restless === true) {
      accel += Math.random() * 0.1 - 0.05;
    } else if (accel < 0.01) {
      this.x = this.gravityX + 0.25;
      this.y = this.gravityY + 0.25;
    }

    var force = 0;
    var fAngle = 0;
    if (ps.mx >= 0 && ps.mouseForce) {
      var mxDist = this.x - ps.mx;
      var myDist = this.y - ps.my;
      var mDistSq = mxDist * mxDist + myDist * myDist;
      force = Math.min(ps.mouseForce / (mDistSq || 1), ps.mouseForce);
      fAngle = Math.atan2(myDist, mxDist);
      if (typeof this.color === 'function') {
        fAngle += Math.PI;
        force *= 0.001 + Math.random() * 0.1 - 0.05;
      }
    }

    this.velocityX += accel * Math.cos(angle) + force * Math.cos(fAngle);
    this.velocityY += accel * Math.sin(angle) + force * Math.sin(fAngle);
    this.velocityX *= 0.92;
    this.velocityY *= 0.92;
    this.x += this.velocityX;
    this.y += this.velocityY;
  }
};

export default function ParticleSlider(options) {
  var self = this;
  self.sliderId = 'particle-slider';
  self.color = '#fff';
  self.hoverColor = '#88f';
  self.width = 0;
  self.height = 0;
  self.ptlGap = 0;
  self.ptlSize = 1;
  self.slideDelay = 0;
  self.arrowPadding = 10;
  self.showArrowControls = false;
  self.onNextSlide = null;
  self.onWidthChange = null;
  self.onHeightChange = null;
  self.onSizeChange = null;
  self.monochrome = false;
  self.mouseForce = 1e4;
  self.restless = true;
  self.imgs = [];
  self.isDestroyed = false;

  if (options) {
    var keys = [
      'color', 'hoverColor', 'width', 'height', 'ptlGap', 'ptlSize',
      'slideDelay', 'arrowPadding', 'sliderId', 'showArrowControls',
      'onNextSlide', 'monochrome', 'mouseForce', 'restless', 'imgs',
      'onSizeChange', 'onWidthChange', 'onHeightChange'
    ];
    for (var i = 0; i < keys.length; i++) {
      if (options[keys[i]] !== undefined) {
        self[keys[i]] = options[keys[i]];
      }
    }
  }

  self.$container = typeof self.sliderId === 'string'
    ? document.getElementById(self.sliderId)
    : self.sliderId;

  if (!self.$container) return;

  self.$$children = self.$container.childNodes;
  self.$canv = self.$container.querySelector('.draw');
  if (!self.$canv) return;

  var slidesElem = self.$container.querySelector('.slides');
  self.$$slides = slidesElem ? Array.from(slidesElem.querySelectorAll('.slide')) : [];

  self.$srcCanv = document.createElement('canvas');
  self.$srcCanv.style.display = 'none';
  self.$container.appendChild(self.$srcCanv);

  self.width = self.width > 0 ? self.width : self.$container.clientWidth || 400;
  self.height = self.height > 0 ? self.height : self.$container.clientHeight || 400;

  self.colorArr = self.parseColor(self.color);
  self.hoverColorArr = self.parseColor(self.hoverColor);
  self.mx = -1;
  self.my = -1;
  self.swipeOffset = 0;
  self.cw = self.getCw();
  self.ch = self.getCh();
  self.frame = 0;
  self.currImg = 0;
  self.lastImg = 0;
  self.imagesLoaded = 0;
  self.pxlBuffer = { first: null };
  self.recycleBuffer = { first: null };

  self.ctx = self.$canv.getContext('2d');
  self.srcCtx = self.$srcCanv.getContext('2d', { willReadFrequently: true });

  self.$canv.width = self.cw;
  self.$canv.height = self.ch;

  // Accurate mouse handlers using getBoundingClientRect
  self.$canv.onmouseout = function () {
    self.mx = -1;
    self.my = -1;
  };

  self.$canv.onmousemove = function (e) {
    var rect = self.$canv.getBoundingClientRect();
    self.mx = (e.clientX - rect.left) * (self.cw / rect.width);
    self.my = (e.clientY - rect.top) * (self.ch / rect.height);
  };

  // Touch support for mobile
  self.$canv.ontouchmove = function (e) {
    if (e.touches && e.touches.length > 0) {
      var rect = self.$canv.getBoundingClientRect();
      self.mx = (e.touches[0].clientX - rect.left) * (self.cw / rect.width);
      self.my = (e.touches[0].clientY - rect.top) * (self.ch / rect.height);
    }
  };

  self.$canv.ontouchend = function () {
    self.mx = -1;
    self.my = -1;
  };

  // Click handler to re-scatter particles
  self.$canv.onclick = function () {
    self.init(true);
  };

  // Load images
  if (self.imgs.length === 0) {
    for (var j = 0; j < self.$$slides.length; j++) {
      var img = new Image();
      self.imgs.push(img);
      img.src = self.$$slides[j].getAttribute('data-src');
    }
  }

  if (self.imgs.length > 0) {
    self.imgs[0].onload = function () {
      self.loadingStep();
    };
    if (self.imgs[0].complete && self.imgs[0].naturalWidth > 0) {
      self.loadingStep();
    }
  }

  self.requestAnimationFrame(function () {
    self.nextFrame();
  });
}

ParticleSlider.prototype.Particle = psParticle;

ParticleSlider.prototype.swapList = function (a, b, c) {
  if (a == null) {
    a = new this.Particle(this);
  } else if (b.first === a) {
    if (a.next != null) {
      a.next.prev = null;
      b.first = a.next;
    } else {
      b.first = null;
    }
  } else if (a.next == null) {
    a.prev.next = null;
  } else {
    a.prev.next = a.next;
    a.next.prev = a.prev;
  }

  if (c.first == null) {
    c.first = a;
    a.prev = null;
    a.next = null;
  } else {
    a.next = c.first;
    c.first.prev = a;
    c.first = a;
    a.prev = null;
  }
};

ParticleSlider.prototype.parseColor = function (a) {
  var b;
  a = a.replace(' ', '');
  if ((b = /^#([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})/.exec(a))) {
    b = [parseInt(b[1], 16), parseInt(b[2], 16), parseInt(b[3], 16), 255];
  } else if ((b = /^#([\da-fA-F])([\da-fA-F])([\da-fA-F])/.exec(a))) {
    b = [parseInt(b[1], 16) * 17, parseInt(b[2], 16) * 17, parseInt(b[3], 16) * 17, 255];
  } else if ((b = /^rgba\(([\d]+),([\d]+),([\d]+),([\d]+|[\d]*\.[\d]+)\)/.exec(a))) {
    b = [+b[1], +b[2], +b[3], +b[4] * 255];
  } else if ((b = /^rgb\(([\d]+),([\d]+),([\d]+)\)/.exec(a))) {
    b = [+b[1], +b[2], +b[3], 255];
  } else {
    return [255, 255, 255, 255];
  }
  return b;
};

ParticleSlider.prototype.loadingStep = function () {
  this.imagesLoaded++;
  this.resize();
};

ParticleSlider.prototype.nextFrame = function () {
  var self = this;
  if (self.isDestroyed) return;

  var b = self.pxlBuffer.first;
  var c = null;
  while (b != null) {
    c = b.next;
    b.move();
    b = c;
  }
  self.drawParticles();

  if (self.frame++ % 30 === 0) {
    var cw = self.getCw();
    var ch = self.getCh();
    if (self.cw !== cw || self.ch !== ch) {
      self.resize();
    }
  }

  setTimeout(function () {
    if (!self.isDestroyed) {
      self.requestAnimationFrame(function () {
        self.nextFrame();
      });
    }
  }, 16);
};

ParticleSlider.prototype.drawParticles = function () {
  if (this.cw <= 0 || this.ch <= 0) return;
  var imgData = this.ctx.createImageData(this.cw, this.ch);
  var data = imgData.data;
  var idx, px, py, x, y, col;
  var p = this.pxlBuffer.first;

  while (p != null) {
    px = ~~p.x;
    py = ~~p.y;
    col = typeof p.color === 'function' ? p.color() : p.color;

    for (x = px; x < px + this.ptlSize && x >= 0 && x < this.cw; x++) {
      for (y = py; y < py + this.ptlSize && y >= 0 && y < this.ch; y++) {
        idx = (y * imgData.width + x) * 4;
        data[idx + 0] = col[0];
        data[idx + 1] = col[1];
        data[idx + 2] = col[2];
        data[idx + 3] = col[3];
      }
    }
    p = p.next;
  }

  this.ctx.putImageData(imgData, 0, 0);
};

ParticleSlider.prototype.getPixelFromImageData = function (imgData, offsetX, offsetY) {
  var pts = [];
  var step = this.ptlGap + 1;
  var w = imgData.width;
  var h = imgData.height;
  var d = imgData.data;

  for (var x = 0; x < w; x += step) {
    for (var y = 0; y < h; y += step) {
      var idx = (y * w + x) * 4;
      if (d[idx + 3] > 30) {
        // Skip pure white background if any
        if (d[idx] > 240 && d[idx + 1] > 240 && d[idx + 2] > 240) continue;

        pts.push({
          x: offsetX + x,
          y: offsetY + y,
          color: this.monochrome
            ? [this.colorArr[0], this.colorArr[1], this.colorArr[2], this.colorArr[3]]
            : [d[idx], d[idx + 1], d[idx + 2], d[idx + 3]]
        });
      }
    }
  }
  return pts;
};

ParticleSlider.prototype.init = function (reshuffle) {
  var self = this;
  if (!self.imgs || self.imgs.length === 0) return;
  var curr = self.imgs[self.currImg];
  if (!curr || !curr.width || !curr.height) return;

  self.$srcCanv.width = curr.width;
  self.$srcCanv.height = curr.height;
  self.srcCtx.clearRect(0, 0, curr.width, curr.height);
  self.srcCtx.drawImage(curr, 0, 0);

  var pts = self.getPixelFromImageData(
    self.srcCtx.getImageData(0, 0, curr.width, curr.height),
    ~~(self.cw / 2 - curr.width / 2),
    ~~(self.ch / 2 - curr.height / 2)
  );

  // Shuffle points for scatter effect
  for (var i = pts.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = pts[i];
    pts[i] = pts[j];
    pts[j] = temp;
  }

  var p = self.pxlBuffer.first;
  for (var k = 0; k < pts.length; k++) {
    var target = null;
    if (p != null) {
      target = p;
      p = p.next;
    } else {
      self.swapList(self.recycleBuffer.first, self.recycleBuffer, self.pxlBuffer);
      target = self.pxlBuffer.first;
    }
    target.gravityX = pts[k].x;
    target.gravityY = pts[k].y;
    target.color = pts[k].color;
  }

  while (p != null) {
    p.ttl = ~~(Math.random() * 10);
    p.gravityY = ~~(self.ch * Math.random());
    p.gravityX = ~~(self.cw * Math.random());
    p = p.next;
  }
};

ParticleSlider.prototype.getCw = function () {
  return Math.min(this.width, this.$container.clientWidth || 400);
};

ParticleSlider.prototype.getCh = function () {
  return Math.min(this.height, this.$container.clientHeight || 400);
};

ParticleSlider.prototype.resize = function () {
  this.cw = this.getCw();
  this.ch = this.getCh();
  this.$canv.width = this.cw;
  this.$canv.height = this.ch;
  this.init(true);
};

ParticleSlider.prototype.requestAnimationFrame = function (fn) {
  var raf = window.requestAnimationFrame || function (cb) { setTimeout(cb, 1000 / 60); };
  raf(fn);
};

ParticleSlider.prototype.destroy = function () {
  this.isDestroyed = true;
  if (this.$canv) {
    this.$canv.onmouseout = null;
    this.$canv.onmousemove = null;
    this.$canv.onclick = null;
    this.$canv.ontouchmove = null;
    this.$canv.ontouchend = null;
  }
  if (this.$srcCanv && this.$srcCanv.parentNode) {
    this.$srcCanv.parentNode.removeChild(this.$srcCanv);
  }
};

