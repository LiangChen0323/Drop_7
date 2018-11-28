/*
                  7x7 Grid 

                      X
          0   1   2   3   4   5   6                    
        -----------------------------
        |___________________________|                                  
      0 |___|___|___|___|___|___|___|
      1 |___|___|___|___|___|___|___|
      2 |___|___|___|___|___|___|___|
  Y   3 |___|___|___|___|___|___|___|
      4 |___|___|___|___|___|___|___|
      5 |___|___|___|___|___|___|___|
      6 |___|___|___|___|___|___|___|
   
*/

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var d_Number = 7;       // discs number               
var d_Size = 42;        // disc size in px            
var d_border = 1;       // disc border in px          
var Grid_TopSpace = 50; // Top space                  
var Grid_Width = d_Number * (d_Size + d_border) - d_border;         //Grid width in px                   
var Grid_Heigh = Grid_Width + Grid_TopSpace;                        //Grid heigh in px, 50 top space       
var grid = Array(d_Number);
var init_grid = Array(d_Number);
var init_Discs_Number = 4;
var init_Pos_X = 3;
var init_Pos_Y = -1;
var init_Pos_TopSpace =3;
var init_Pos = 3;
var current_Pos = init_Pos;
var drop_Pos_Y;
var score=0;
var score_factor = 7;
var grid; // a 7x7 array stores discs

//draw a grey background and lines
drawBackGround = function(){
    ctx.fillStyle = "#404040";
    ctx.fillRect(0, 0, Grid_Width, Grid_Heigh);
    var i, j;
    for(i = 0 ; i < d_Number; i++){
        for(j = 0; j < d_Number; j++){
            ctx.fillStyle = "#808080";
            ctx.fillRect(i * (d_Size +d_border),     //x
            Grid_TopSpace + j * (d_Size +d_border),  //y
            d_Size,d_Size);
        }
    } 
}



//Place numbers in centre of discs
drawDisc = function(y,x,value){
    
    if(value >= "1" && value <= "7"){

        var Posx = x * (d_Size + d_border);
        var Posy = Grid_TopSpace + y * (d_Size + d_border);

        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.font = "32px Arial";
        ctx.strokeStyle = "rgb(255, 255, 255)";
        ctx.lineWidth = "2";
        var Pos_x = Posx + parseInt(d_Size /2);
        var Pos_y = Posy + parseInt(d_Size -10);

        ctx.strokeText(value, Pos_x, Pos_y);
        ctx.fillText(value, Pos_x, Pos_y);

    }
}

//check each block start from grid bottom in given lines, if a block doesn't have value, give it value
checkGrid = function(x, value){
    console.log(value+" "+x);
    for(var y = d_Number -1;  y >=0 ; y--){
        if(grid[y][x]==null || grid[y][x]==false){
            grid[y][x] = value;
            drawDisc(y,x,value);  
            break;
        }
    }
}

checkDrop = function(x){
    for(var y = 6; y >=0; y--){
        if(grid[y][x] == null || grid[y][x]==false ){
            return y;
        }
    }
    return false;
}

drawGrid = function(offset){
    //clear and redraw the grid every time move the disc 
    ctx.clearRect(0,0,Grid_Width,Grid_Heigh);
    drawBackGround();

    for(var i = 0; i<=6 ;i++)
    {
        for(var j = 0; j<=6; j++)
        {
            if(grid[i][j]>=1 && grid[i][j]<=7)
            {
                drawDisc(i,j,grid[i][j]);
            }
        }
    }
    drawGridTop(offset);
}

//BUG: disc can move out of canvas before drop it 
drawGridTop =function(offset){
    current_Pos += offset;
    //keep the disc in the grid
    if(current_Pos < 0){
        current_Pos=0;
        init_Pos=1;
    } 
    
    if(current_Pos > 6)
    {
        current_Pos=6;
        init_Pos=5;
    }

    init_grid[current_Pos] = init_grid[init_Pos];
    init_grid[init_Pos] = false;
    
    if(init_grid[current_Pos] != false )
    drawDisc(init_Pos_Y, current_Pos, init_grid[current_Pos]);

    init_Pos += offset;
}

gameOver = function () {
    //stop the game, show the score
    console.log("Game Over"); //need to do: make it on the screen
}

//check if a disc is destroyable(X and Y)
destroyableDiscs = function(y,x,destroyable_Discs){
   var check_vertical = 0;
   var check_horizontal_1 = 0;
   var check_horizontal_2 = 0;
   //Check Vertical first
   for(var ver= d_Number -1; ver >=0; ver--){
       if(grid[ver][x] >= 1 && grid[ver][x] <=7){
            check_vertical++;
       }
    }
    
    for(var current_y = d_Number-1; current_y>=0;current_y--){
        if(check_vertical === grid[current_y][x]){
                destroyable_Discs.push({y:current_y, x:x});
        }
    }

    //Check Horizontal 
    //divide a column into two parts according to current checking disc
    for(var current_x_1 = 0 ; current_x_1 < x; current_x_1++){
       // console.log(current_x_1);
        if(grid[y][current_x_1] >= 1 && grid[y][current_x_1] <=7)
            {check_horizontal_1++;}else{check_horizontal_1=0;}
    }

    for(var current_x_2 = d_Number -1 ; current_x_2 > x; current_x_2--){
        if(grid[y][current_x_2] >= 1 && grid[y][current_x_2] <=7 )
            {check_horizontal_2++;}else{check_horizontal_2=0;}
    }

    //any disc has same value as gild[y][x] to be false
    if(((check_horizontal_1+check_horizontal_2+1) === grid[y][x]) && grid[y][x]!=1){
        destroyable_Discs.push({y:y, x:x});
    }


    return destroyable_Discs;

}

//move any discs need to be placed
moveDiscs = function(destroyable_Discs){
    var score_counter=0;
    for(var key in destroyable_Discs)
    {
      score_counter++;  
      grid[destroyable_Discs[key].y][destroyable_Discs[key].x] = false;
    }
    console.log("Score: "+ score_counter);
    for(var x = 0; x< d_Number-1;x++){
        for(var y = d_Number -1 ; y>=0 ; y--){
            y_top = y-1;
            if(y_top <=0) y_top=0;
            if((grid[y][x]==false || grid[y][x]== null) &&
                (grid[y_top][x] >= 1 && grid[y_top][x]<=7)){
                grid[y][x]=grid[y-1][x];
                grid[y-1][x]=false;
            }
        }
    }

    //redraw grid
    ctx.clearRect(0,50,Grid_Width,Grid_Heigh);
    drawBackGround();
    drawNextDisc();
    for(var i = 0; i<=6 ;i++)
    {
        for(var j = 0; j<=6; j++)
        {
            if(grid[i][j]>=1 && grid[i][j]<=7)
            {
                drawDisc(i,j,grid[i][j]);
            }
        }
    }

}

//destroy discs (give discs value false)
clearDiscs = function(){

    var destroyable_Discs = [];
    
    //From bottom to top
    for(var x = 0; x <= d_Number - 1 ; x++){
        for(var y = d_Number -1 ; y >=0 ; y--){
            destroyable_Discs = destroyableDiscs(y,x, destroyable_Discs);
        }
    }
    moveDiscs(destroyable_Discs);
}

drawNextDisc = function(){
    current_Pos = init_Pos_TopSpace;
    var disc_value = discValue();

    for(i = 0; i <= 6;i++){
        init_grid[i] = false;
    }
    init_grid[init_Pos_TopSpace] = disc_value;
    drawDisc(init_Pos_Y, init_Pos_TopSpace, init_grid[init_Pos_TopSpace]);

}


dropDisc = function(){
    ctx.clearRect(0,50,Grid_Width,Grid_Heigh);
    drawBackGround();

    if(checkDrop(current_Pos) === false){    //if the column is full
        gameOver();
    }else{
        drop_Pos_Y = checkDrop(current_Pos);  //if it is not full, get the position where the disc needs to go
        grid[drop_Pos_Y][current_Pos] = init_grid[current_Pos];
        for(var i = 0; i<=6 ;i++)
        {
            for(var j = 0; j<=6; j++)
            {
                if(grid[i][j]>=0 && grid[i][j]<=7 )
                {
                    drawDisc(i,j,grid[i][j]);
                }
            }
        }
        drawNextDisc();
        //clearDiscs();
        
        current_Pos = init_Pos_TopSpace;
        init_Pos = init_Pos_TopSpace;
    }

}

document.onkeydown = function(event)
{
    switch(event.keyCode){
        case 37:
           var offset = -1;
           drawGrid(offset);
           return;
        case 39:
            var offset_1 = 1;
            drawGrid(offset_1);
            return;
        case 32:
             dropDisc();
             clearDiscs();
             //showGrid();
             return;
    }
}


discValue = function(){
    return value = Math.floor(Math.random()*7 + 1);
}

//when game starts, generate 3 discs with random value
initGrid = function(){
    drawBackGround();
    for(i = 0; i<grid.length; i++){
        grid[i] = Array(d_Number); 
    }
    
    for(i = 0; i< init_Discs_Number; i++){
        var x = Math.floor(Math.random()*6); //generate random integers for placing discs 
        checkGrid(x, discValue());
    }

    //draw first disc for drop
    drawNextDisc();
    clearDiscs();
}

showGrid = function (){
    console.log(init_grid);
    console.log(grid);
}

initGrid();

//showGrid();
