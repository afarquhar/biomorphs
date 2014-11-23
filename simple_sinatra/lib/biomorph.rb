class Biomorphs
  def initialize(initial = [4, 5, 2, 4, 3, 1, -4, -4, 8])
    @initial = initial
    @biomorphs = create_from(@initial) 
  end
  
  def go
    @biomorphs.each_with_index do |b, i|
        doc = "<?xml version='1.0' standalone='no'?>
              <!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 
              'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'>"
      
      doc << b.to_svg
      outfile = File.join(File.dirname(__FILE__), "../public/javascript/biomorph_#{i}.svg")
      File.open(outfile,  "w+") do |f|
        f.write(doc)
      end
    end
    
    @biomorphs
  end
  
  private
  
  def create_from(initial)
    (0...1).map do |child| 
      i_to_change = rand(initial.size)
      delta = [1, -1].shuffle.first
      new_genes = initial.clone
      new_genes[i_to_change] += delta
      Biomorph.new(new_genes)
    end
  end
  
end


class Biomorph
  
  def initialize(genes)
    @genes = genes
    @lines = []
    init(genes)
    go
  end

  def go
    draw_tree(300, 150, @branching, 2, @dx, @dy, @lines)
    to_svg
  end
 
  
  def to_svg
    svg = "<svg version='1.1' xmlns='http://www.w3.org/2000/svg'>"
    svg << @lines.map {|line| "<line x1='#{line[0]}' y1='#{line[1]}' x2='#{line[2]}' y2='#{line[3]}' style='stroke:rgb(99,99,99);stroke-width:1'/>\n" }.join
    svg << "</svg>"
  end
  
  def genes
    @genes.inspect
  end
  
  private
  
    
  def init(genes)
    @dx = []
    @dy = []
    
    
    @branching = genes[8] > 10 ? 10 : genes[8]
    @dx[3] = genes[0]
    @dx[4] = genes[1]
    @dx[5] = genes[2]
    @dx[1] = -(@dx[3])
    @dx[0] = -(@dx[4])
    @dx[7] = -(@dx[5])
    @dx[2] = 0
    @dx[6] = 0
    
    @dy[2] = genes[3] 
    @dy[3] = genes[4] 
    @dy[4] = genes[5] 
    @dy[5] = genes[6] 
    @dy[6] = genes[7] 
    
    @dy[0] = @dy[4] 
    @dy[1] = @dy[3] 
    @dy[7] = @dy[5]
    
  end
  
  def draw_tree(x, y, length, dir, dx, dy, lines)
    dir = 7 if dir < 0
    dir = 0 if dir >=8
    x_new = x + length * dx[dir]
    y_new = y + length * dy[dir]
    @lines << [x, y, x_new, y_new]

    if(length > 0)
      draw_tree(x_new, y_new, length-1, dir-1, dx, dy, @lines)
      draw_tree(x_new, y_new, length-1, dir+1, dx, dy, @lines)
    end
  end
  

end
if __FILE__ == $0
  Biomorphs.new.go
end

