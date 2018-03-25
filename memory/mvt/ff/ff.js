var part_size = [];
var total_mem_size = 0;
var num_parts = 0;
var myCanvas_width = 150;
var myCanvas_height = 500;
var myCanvas_x_start = 10;
var myCanvas_y_start = 10;
var part_myCanvas_start = [];
var part_myCanvas_end = [];
var part_start = [];
var part_end = [];
var part_pro_id = [];
cur_pro_id = 0;
var part_occupied = [];

$(document).ready(function() {
    $("#mem-size-btn").click(function(){
        total_mem_size = Number($("#mem-size").val());
        startColumn2();
    }); 
}); 

function startColumn2() {
    var htmlText = 
    `
    <button type="submit" class="btn btn-primary" id="add-pro-btn">Add process</button>
    <button type="submit" class="btn btn-primary" id="rem-pro-btn">Remove process</button>
    `;
    $("#add-rem-pro-btns").html(htmlText);
    var htmlText = 
    `
    <canvas id="myCanvas" width="170" height="520" style="border:1px solid #d3d3d3;">
                Your browser does not support the HTML5 canvas tag.</canvas>
    `;
    $("#canvas").html(htmlText);
    drawMemory();
    $(document).ready(function() {
        $("#add-pro-btn").click(function(){
            addProcessSize();
        }); 
        $("#rem-pro-btn").click(function(){
            remProcessId();
        }); 
    });

}

function addProcessSize() {
    var htmlText =
    `
    <div class="form-group">
        <label>Size of process to be added: </label>
        <input type="text" class="form-control" id="add-pro-size" placeholder="Enter size of process to be added">      
    </div>
    <button type="submit" class="btn btn-primary" id="add-btn">Add</button>
    `;
    $("#add-rem-pro").html(htmlText);
    $(document).ready(function() {
        $("#add-btn").click(function(){
            var size_pro = Number($("#add-pro-size").val());
            cur_pro_id += 1;
            addProcess(size_pro, cur_pro_id);
        }); 
    }); 
}

function addProcess(size_pro, pro_id) {
    var i;
    var found = 0;
    if(num_parts == 0) {
        addPart(0, size_pro, pro_id);
        found = 1;
    }
    else {
        for(i = 0; i < num_parts; i++) {

            if(i == 0) {
                if(part_start[0] >= size_pro) {
                    addPart(0, size_pro, pro_id);
                    found = 1;
                    break;
                }
            }
            else if(found == 0) {
                if((part_start[i] - part_end[i-1]) >= size_pro) {
                    addPart(i, size_pro, pro_id);
                    found = 1;
                    break;
                }
            }
        }
        if(found == 0) {
            if((total_mem_size - part_end[num_parts-1]) >= size_pro) {
                addPart(num_parts, size_pro, pro_id);
                found = 1;
            }
        }
    }

    if(found == 0) {
        alert('New process could not be added.');
    }
}    

function addPart(index, size_pro, pro_id) {
    part_pro_id[num_parts] = pro_id;
    part_size[num_parts] = size_pro;
    if(index == 0) {
        part_start[num_parts] = 0;
        part_end[num_parts] = size_pro;
    }
    else if(index < num_parts) {
        part_start[num_parts] = part_end[index-1];
        part_end[num_parts] = part_start[num_parts] + size_pro;
    }
    else {
        part_start[num_parts] = part_end[num_parts-1];
        part_end[num_parts] = part_start[num_parts] + size_pro;
    }
    num_parts += 1;
    sortPart();
    drawPart();
}

function sortPart() {
    var i;
    var j;
    for(i = 0; i < num_parts; i++) {
        for(j = 0; j < (num_parts - i -1); j++) {
            if(part_start[j] > part_start[j+1]) {
                var temp = part_start[j];
                part_start[j] = part_start[j+1];
                part_start[j+1] = temp;

                temp = part_end[j];
                part_end[j] = part_end[j+1];
                part_end[j+1] = temp;

                temp = part_size[j];
                part_size[j] = part_size[j+1];
                part_size[j+1] = temp;

                temp = part_pro_id[j];
                part_pro_id[j] = part_pro_id[j+1];
                part_pro_id[j+1] = temp;
            }
        }
    }
}

function drawPart() {
    var ctx=document.getElementById("myCanvas").getContext("2d");
    ctx.beginPath();
    ctx.rect(myCanvas_x_start, myCanvas_y_start, myCanvas_width, myCanvas_height);
    ctx.fillStyle = "white";
    ctx.fill();
    var i;
    for(i = 0; i < num_parts; i++) {
        ctx.beginPath();
        ctx.rect(myCanvas_x_start, myCanvas_y_start + part_start[i]*(500/total_mem_size), myCanvas_width, part_size[i]*(500/total_mem_size));
        ctx.fillStyle = "green";
        ctx.fill();

        ctx.font = "14px Arial bold";
        ctx.fillStyle = "black";
        ctx.fillText("P-"+ String(part_pro_id[i]), myCanvas_width/2, myCanvas_y_start + part_start[i]*(500/total_mem_size) + part_size[i]*(500/total_mem_size)/2);
    }
}

function remProcessId() {
    var htmlText =
    `
    <div class="form-group">
        <label>Id of process to be removed: </label>
        <input type="text" class="form-control" id="rem-pro-id" placeholder="Enter id of process to be removed">      
    </div>
    <button type="submit" class="btn btn-primary" id="rem-btn">Remove</button>
    `;
    $("#add-rem-pro").html(htmlText);
    $(document).ready(function() {
        $("#rem-btn").click(function(){
            var id_pro = Number($("#rem-pro-id").val());
            remProcess(id_pro);
        }); 
    }); 
}

function remProcess(id_pro) {
    var i;
    var found = 0;
    for(i = 0; i < num_parts; i++) {
        if(part_pro_id[i] == id_pro && found == 0) {

            var j;
            for(j = i+1; j < num_parts; j++) {
                part_pro_id[j-1] = part_pro_id[j];
                part_start[j-1] = part_start[j];
                part_end[j-1] = part_end[j];
                part_size[j-1] = part_size[j];
            }
            found = 1;
            num_parts -= 1;
            break;
        }
    }
    if(found == 1) {
        drawPart();
    }
    else {
        alert("Process-" + String(id_pro) + " not found in memory");
    }
}

function drawMemory() {
    var c=document.getElementById("myCanvas");
    var ctx=c.getContext("2d");
    ctx.rect(myCanvas_x_start,myCanvas_y_start,myCanvas_width,myCanvas_height);    
    ctx.stroke();  
}