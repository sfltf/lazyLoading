!(function() {
    var lazyLoading = {

    }

    function loading() {

    }

    loading.prototype.elems = function(type, className, father, order) {
        var targetE = document.createElement(type);
        if (className) {
            if (typeof className == "object") {
                Object.keys(className).forEach(function(item, index) {
                    targetE.setAttribute(item, className[item]);
                })
            }
        }
        if (order) {
            document.querySelectorAll(father)[order].appendChild(targetE);
        } else {
            document.querySelector(father).appendChild(targetE);
        }

    }

    loading.prototype.splice = function(order, height, rows, elem, dataArr) {
        var lastE = Math.ceil(height / (this.liHeight + 10)) * rows + order * Math.ceil(height / (this.liHeight + 10)) * rows;
        if (lastE > dataArr.length) {
            lastE = dataArr.length;
        }

        for (var i = order * Math.ceil(height / (this.liHeight + 10)) * rows; i < lastE; i++) {
            this.elems('li', { class: "lazyLoading-list" }, elem);
            this.elems('img', { class: "lazyLoading-img", src: "../images/bg.jpg", dataSrc: this.dataArr[i].dataSrc }, ".lazyLoading-list", i);
            document.querySelectorAll('.lazyLoading-list')[i].style.width = this.liWidth + 'px';
            document.querySelectorAll('.lazyLoading-list')[i].style.height = this.liHeight + 'px';
            document.querySelectorAll('.lazyLoading-list')[i].style.paddingLeft = this.marginL + 'px';
            document.querySelectorAll('.lazyLoading-list')[i].style.marginBottom = this.marginL + 'px';
            try {
                document.querySelector(elem).removeChild(document.querySelector('.lazyLoading-span'));
            } catch (e) {

            }
            if (i == lastE - 1 && i !== dataArr.length - 1) {
                this.elems('div', { class: "lazyLoading-span" }, elem);
                document.querySelector('.lazyLoading-span').innerHTML = "加载更多";
            }
            
            var dataSrc = document.querySelectorAll('.lazyLoading-list')[i].firstElementChild.getAttribute('dataSrc');
            document.querySelectorAll('.lazyLoading-list')[i].firstElementChild.setAttribute('src', dataSrc);
            
            if (i == dataArr.length - 1) {
                this.elems('div', { class: "lazyLoading-span" }, elem);
                document.querySelector('.lazyLoading-span').innerHTML = "我是有底线的";
            }
        }
    }

    loading.prototype.init = function(elem, width, height, rows, aspectRatio, imgJsonUrl) {
        var self = this;
        self.dataArr = [];
        var imgLength = 0;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    imgLength = JSON.parse(xhr.response).length;
                    JSON.parse(xhr.response).forEach(function(item) {
                        self.dataArr.push(item);
                    })
                }
            }
        }
        xhr.open('get', imgJsonUrl, false);
        xhr.send(null);
        if (typeof width == 'string') {
            document.querySelector(elem).style.width = document.body.clientWidth * parseInt(width) * 0.01 + 'px';
        } else if (typeof width == 'number') {
            document.querySelector(elem).style.width = width + 'px';
        }

        if (typeof height == 'string') {
            document.querySelector(elem).style.height = document.body.clientHeight * parseInt(height) * 0.01 + 'px';
        } else if (typeof height == 'number') {
            document.querySelector(elem).style.height = height + 'px';
        }
        this.marginL = 10;
        this.marginLTotal = this.marginL * (rows + 1);
        this.liWidth = (document.querySelector(elem).offsetWidth - this.marginLTotal) / rows;
        this.liHeight = this.liWidth * aspectRatio;
        this.bindEvents(elem, height, this.liHeight, rows, self.dataArr);
        this.splice(0, height, rows, elem, self.dataArr);

    }

    loading.prototype.bindEvents = function(elem, height, liHeight, rows, dataArr) {
        var self = this;
        self.index = 0;
        document.querySelector(elem).addEventListener('scroll', function() { self.viewport(elem, height, liHeight, rows, dataArr) }, false);
    }

    loading.prototype.viewport = function(elem, height, liHeight, rows, dataArr) {
        if (document.querySelector(elem).offsetHeight + document.querySelector(elem).scrollTop == document.querySelector(elem).scrollHeight) {
            ++this.index;
            this.splice(this.index, height, rows, elem, dataArr);
        }
    }

    loading.prototype.load = function(opt) {
        var lazyElem = opt.elem;
        opt.lazyWidth = opt.width ? opt.width : 300;//可以是数字也可以是字符串百分比
        opt.lazyHeight = opt.height ? opt.height : 200;//可以是数字也可以是字符串百分比
        opt.lazyRows = opt.rows ? opt.rows : 1;//每行图片个数
        opt.lazyAspectRatio = opt.aspectRatio ? opt.aspectRatio : 0.618;//图片宽高比
        var imgJsonUrl = opt.imgJsonUrl;//图片json文件
        this.init(lazyElem, opt.lazyWidth, opt.lazyHeight, opt.lazyRows, opt.lazyAspectRatio, imgJsonUrl);
    }

    lazyLoading = new loading();
    window.lazyLoading = lazyLoading;
})()

lazyLoading.load({
    elem: '#demo',
    width: '80%',
    height: 300,
    rows: 2,
    imgJsonUrl: '../json/data.json',
    aspectRatio : 0.5
})
