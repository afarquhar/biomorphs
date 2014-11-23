
var createBiomorph = function () {



// private data.
    var treeDepth = 0;

    var N = 0;
    var NE = 1;
    var E = 2;
    var SE = 3;
    var S = 4;
    var SW = 5;
    var W = 6;
    var NW = 7;

    var maxSegmentLen = 0;

    // Map x -> x1
    var dx = [];
    dx[N] = 0;
    dx[NE] = 1;
    dx[E] = 1;
    dx[SE] = 1;
    dx[S] = 0;
    dx[SW] = -1;
    dx[W] = -1;
    dx[NW] = -1;

    // Map y -> y1
    var dy = [];
    dy[N] = -1;
    dy[NE] = -1;
    dy[E] = 0;
    dy[SE] = 1;
    dy[S] = 1;
    dy[SW] = 1;
    dy[W] = 0;
    dy[NW] = -1;
    
    function rand() {
        return Math.floor(Math.random()*21);
    }

    function randomize() {

        newgenes = [];
        newgenes[0] = rand();  // depth
        newgenes[1] = rand();  // x-scale levels 3, 6, 9
        newgenes[2] = rand();  // x-scale levels 1, 4, 7
        newgenes[3] = rand();  // x-scale levels 2, 5, 8
        newgenes[4] = rand();  // y-scale levels 3, 6, 9
        newgenes[5] = rand();  // y-scale levels 1, 4, 7
        newgenes[6] = rand();  // y-scale levels 2, 5, 8
        newgenes[7] = rand();  // red
        newgenes[8] = rand();  // green
        newgenes[9] = rand();  // blue
        newgenes[10] = rand(); // width
        return newgenes;
    }

  return {

    genes: randomize(),

    drawTree: function(svg, x, y, max_x, max_y, treeDepth, treeGrowthDirection, maxSegmentLen) {
      

      if( treeGrowthDirection < 0 ) {
          treeGrowthDirection += 8;
      }
      else if( treeGrowthDirection > 7 ) {
          treeGrowthDirection -= 8;
      }
      
      var xoffset = dx[treeGrowthDirection];
      var yoffset = dy[treeGrowthDirection];
      
      var xGene = (treeDepth % 3) + 1;
      var yGene = xGene + 3;

      
      
      // var i = x + Math.floor( xoffset*( this.genes[xGene] * 2579 ) % maxSegmentLen );
      // var j = y + Math.floor( yoffset*( this.genes[yGene] * 5051 ) % maxSegmentLen );
      var i = x + Math.floor( xoffset*( this.genes[xGene]  ) % maxSegmentLen );
      var j = y + Math.floor( yoffset*( this.genes[yGene] ) % maxSegmentLen );


      var rscale = Math.floor( this.genes[7] * 577) % 255;
      var gscale = Math.floor( this.genes[8] * 1297) % 255;
      var bscale = Math.floor( this.genes[9] * 2089) % 255;
      
      var r = (rscale + treeDepth * 97) % 255;
      var g = (gscale + treeDepth * 97) % 255;
      var b = (bscale + treeDepth * 97) % 255;
      
      // var color = 'rgba('+r+','+g+','+b+',.7)';
      var color = 'rgba('+r+','+r+','+r+',.8)';
      // var color = '#777777';
      
      var width = Math.abs( this.genes[10]*treeDepth ) % 5 + 1;

      var points = [[x, y], [i, j]]


      if( treeDepth <= 0 || i > max_x || j > max_y) {
          return;
      }

      var lineFunction = d3.svg.line()
                               .x(function(d) { return d[0]; })
                               .y(function(d) { return d[1]; })

                               .interpolate("linear");


      //The line SVG Path we draw
      var lineGraph = svg.append("path")
                                  .attr("d", lineFunction(points))
                                  .attr("stroke", color)
                                  .attr("stroke-width", 1)
                                  .attr("fill", "none");

      
      
      // Draw the left and right subtrees recursively.
      this.drawTree(svg, i, j, max_x, max_y, treeDepth-1, treeGrowthDirection+1, maxSegmentLen);
      this.drawTree(svg, i, j, max_x, max_y, treeDepth-1, treeGrowthDirection-1, maxSegmentLen );
    }, 


    mutateGenes: function() {

        // select a gene to mutate.
        var gene = Math.floor(Math.random() * this.genes.length);

        var result = this.genes.slice(0);

        // Mutate thegene, either gene+=1 or gene-=1
        if( 0==Math.floor( Math.random(2) ) ) {
            result[gene] = result[gene] - 1;
            if( result[gene] < 0 ) {
                result[gene] = 20;
            }
        } else {
            result[gene] = result[gene] + 1;
            if( result[gene] > 20 ) {
                result[gene] = 0;
            }
        }

        this.genes = result;
    },

    go: function(){

      var width = 200;
      var height = 200;

      var x = width / 2;
      var y = height / 2;


      
      var initTreeGrowthDirection = N;
      var maxSegmentLen = Math.floor(width / 8);
      // var treeDepth = this.genes[0] % 9 + 1;  // min depth=1, max depth is 10
      var treeDepth = 7
      console.log('treeDepth', treeDepth)
      var svgContainer = d3.select("body").append("svg")
                                          .attr("width", width)
                                          .attr("height", width);

      var that = this;
      setInterval(function(){
        console.log('go')
        that.mutateGenes();
        svgContainer.selectAll("*").remove();
        that.drawTree(svgContainer, x, y, width, height, treeDepth, initTreeGrowthDirection, maxSegmentLen);

      }, 20)

    }


    


  }

}
