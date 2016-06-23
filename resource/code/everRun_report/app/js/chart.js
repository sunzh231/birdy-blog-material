(function(){
	var margin = {top: 20, right: 20, bottom: 30, left: 150},
    width = 660 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

    var x = d3.scale.linear()
	    .domain([0, 60])
	    .range([0, width]);

    var y = d3.scale.linear()
       .range([height, 0]);

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom")
		.ticks(12);

	var yAxis = d3.svg.axis()
		.orient("left");

    var color = d3.scale.category20();

    var line_generator = d3.svg.line()
	    .tension(0.1).interpolate("linear")
	    .x(function(d) { return x(d.px); })
	    .y(function(d) { return y(d.py); });

    var chart = {

    	init: function(m){
    		var allCpu = [];
    			var allDisk = [];
    			var allNetwork = [];

				$(".chooseMachine").each(function() {
					if($(this).prop("checked")) {
				 		$.merge(allCpu, m.get($(this).val()).cpu);
	     				$.merge(allDisk, m.get($(this).val()).disk);
	     				$.merge(allNetwork, m.get($(this).val()).network);
			     	} 
				});
				chart.drawCpuAxis(allCpu);
				chart.drawDiskAxis(allDisk);
				chart.drawNetworkAxis(allNetwork);
				chart.updateListener(m);
    	},

    	initGlobalOptions: function(data){
			var src = document.getElementById('globalOptionsTemplate').textContent;
			var compiled = dust.compile(src, 'globalOptionsTemplate');
			dust.loadSource(compiled);

			var physicalMachineNames = [];
			var virtualMachineNames = [];
			$.each(data,function(i,v){

				if(v.type == "physical") {
					physicalMachineNames.push({name: v.name});
				} else if (v.type == "virtual") {
					virtualMachineNames.push({name: v.name});
				}
			})

			var options = {
			  	physicalMachines: physicalMachineNames,
			  	virtualMachines: virtualMachineNames
			}

			dust.render('globalOptionsTemplate', options, function(err, out) {
			  $('#globalOptions').html(out);
			});
		},

    	drawCpuAxis: function(data){
		    y.domain([0, d3.max(data, function(c) {
		        return d3.max(c.points, function(d){
		             	return d.py;
		            });
		        })
		    ]);

		    var svg = d3.select(".cpu_chart").append("svg")
			    .attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom + 50)
			    .attr("class", "cpu")

			var svg_chart = svg.append("g")
			    .attr("class", "chart")
			    .attr("transform", "translate(" + margin.left + "," + 10 + ")");

			svg_chart.append("rect")
			    .attr("width", width)
			    .attr("height", height);

			var xInner = d3.svg.axis()
				.scale(x)
				.tickSize(-height)
				.tickFormat("")
				.orient("bottom")
				.ticks(20);

			var xInnerBar=svg_chart.append("g")
				.attr("class","inner_line")
				.attr("transform", "translate(0," + height + ")")
				.call(xInner);

			var yInner = d3.svg.axis()
				.scale(y)
				.tickSize(-width)
				.orient("left")
				.ticks(10);

			var yInnerBar=svg_chart.append("g")
				.attr("class", "inner_line")
				.call(yInner);

		    xAxis.scale(x);
		    yAxis.scale(y).ticks(10);

			var xBar = svg_chart.append("g")
			    .attr("class", "x axis")
			    .attr("transform", "translate(0," + height + ")")
			    .call(xAxis);

			var yBar = svg_chart.append("g")
			    .attr("class", "y axis")
			    .call(yAxis)
			    .append("text")
			    .attr("transform", "rotate(-90)")
			    .attr("y", 6)
			    .attr("dy", ".71em")
			    .style("text-anchor", "end")
			    .text("Percentage (%) ");

			chart.updateLines(data,'cpu');
    	},

    	drawDiskAxis: function(data){
    		
		    y.domain([0, d3.max(data, function(c) {
		        return d3.max(c.points, function(d){
		             	return d.py;
		            });
		        })
		    ]);

		    var svg = d3.select(".disk_chart").append("svg")
			    .attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom + 50)
			    .attr("class", "disk")

			var svg_chart = svg.append("g")
			    .attr("class", "chart")
			    .attr("transform", "translate(" + margin.left + "," + 10 + ")");
			    
			svg_chart.append("rect")
			    .attr("width", width)
			    .attr("height", height);

			var xInner = d3.svg.axis()
				.scale(x)
				.tickSize(-height)
				.tickFormat("")
				.orient("bottom")
				.ticks(12);

			var xInnerBar=svg_chart.append("g")
				.attr("class","inner_line")
				.attr("transform", "translate(0," + height + ")")
				.call(xInner);

			var yInner = d3.svg.axis()
				.scale(y)
				.tickSize(-width)
				.orient("left")
				.ticks(10);

			var yInnerBar=svg_chart.append("g")
				.attr("class", "inner_line")
				.call(yInner);

		    xAxis.scale(x);
		    yAxis.scale(y).ticks(10);

			var xBar = svg_chart.append("g")
			    .attr("class", "x axis")
			    .attr("transform", "translate(0," + height + ")")
			    .call(xAxis);

			var yBar = svg_chart.append("g")
			    .attr("class", "y axis")
			    .call(yAxis)
			    .append("text")
			    .attr("transform", "rotate(-90)")
			    .attr("y", 6)
			    .attr("dy", ".71em")
			    .style("text-anchor", "end")
			    .text("Percentage (%) ");

			chart.updateLines(data,'disk');

    	},

    	drawNetworkAxis: function(data){
    		  
			y.domain([0, d3.max(data, function(c) {
		        return d3.max(c.points, function(d){
		             	return d.py;
		            });
		        })
		    ]);

		    var svg = d3.select(".network_chart").append("svg")
			    .attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom + 50)
			    .attr("class", "network")

			var svg_chart = svg.append("g")
			    .attr("class", "chart")
			    .attr("transform", "translate(" + margin.left + "," + 10 + ")");
			    
			svg_chart.append("rect")
			    .attr("width", width)
			    .attr("height", height);

			var xInner = d3.svg.axis()
				.scale(x)
				.tickSize(-height)
				.tickFormat("")
				.orient("bottom")
				.ticks(12);

			var xInnerBar=svg_chart.append("g")
				.attr("class","inner_line")
				.attr("transform", "translate(0," + height + ")")
				.call(xInner);

			var yInner = d3.svg.axis()
				.scale(y)
				.tickSize(-width)
				.orient("left")
				.ticks(10);

			var yInnerBar=svg_chart.append("g")
				.attr("class", "inner_line")
				.call(yInner);

		    xAxis.scale(x);
		    yAxis.scale(y).ticks(10);

			var xBar = svg_chart.append("g")
			    .attr("class", "x axis")
			    .attr("transform", "translate(0," + height + ")")
			    .call(xAxis);

			var yBar = svg_chart.append("g")
			    .attr("class", "y axis")
			    .call(yAxis)
			    .append("text")
			    .attr("transform", "rotate(-90)")
			    .attr("y", 6)
			    .attr("dy", ".71em")
			    .style("text-anchor", "end")
			    .text("Percentage (%) ");

			chart.updateLines(data,'network');
    	},

		addLegend: function (data, id) {
			d3.select(id).select(".legend").remove();
			var legend=d3.select(id).append("g")
				.attr("class", "legend")
				.attr("transform", "translate(" + (margin.left + 15) + "," + (height + margin.top + margin.bottom) + ")");

			var textGroup=legend.selectAll("text")
				.data(data);

			textGroup.exit().remove();

			legend.selectAll("text")
				.data(data)
				.enter()
				.append("text")
				.text(function(d){return d.name;})
				.attr("class","legend")
				.attr("x", function(d,i) {return i*100;})
				.attr("y",0)
				.attr("fill",function(d,i){ return d.name;});

			var rectGroup=legend.selectAll("rect")
				.data(data);

			rectGroup.exit().remove();

			legend.selectAll("rect")
				.data(data)
				.enter()
				.append("rect")
				.attr("x", function(d,i) {return i*100-20;})
				.attr("y",-10)
				.attr("width",12)
				.attr("height",12)
				.attr("fill",function(d,i){ 
					return color(d.name);
				});

		},

    	updateLines: function(data, id){
    		y.domain([0, d3.max(data, function(c) {
		        return d3.max(c.points, function(d){
		            	return d.py;
		        	});
		        })
		    ]);

    		xAxis.scale(x);
		    yAxis.scale(y);

    		id = "." + id;
    		d3.select(id).selectAll(".city").remove();
    		var svg = d3.select(id);

    		svg.select(".chart").select(".y").remove();
		    svg.select(".chart").append("g")
			    .attr("class", "y axis")
			    .call(yAxis)
			    .append("text")
			    .attr("transform", "rotate(-90)")
			    .attr("y", 6)
			    .attr("dy", ".71em")
			    .style("text-anchor", "end")
			    .text("Percentage (%) ");

    		var city = svg.select(".chart").selectAll(".city")
    			.data(data)
    			.enter().append("g")
			    .attr("class", "city");
    			
    		city.append("path")
			    .attr("class", "line")
			    .attr("d", function(d) {
			    	return line_generator(d.points); 
			    })
			    .style("stroke", function(d) { 
			        return color(d.name); 
			    })
			    .style("fill","none")
				.style("stroke-width",2)
				.style("stroke-opacity",0.9);

			chart.addLegend(data, id);
		},

    	updateListener: function(m){
    		$("input[type='checkbox']").click(function(){

	    		var allCpu = [];
				var allDisk = [];
				var allNetwork = [];
	    		$(".chooseMachine").each(function() {
					if($(this).prop("checked")) {
						$.merge(allCpu, m.get($(this).val()).cpu);
	    				$.merge(allDisk, m.get($(this).val()).disk);
	    				$.merge(allNetwork, m.get($(this).val()).network);
			    	}
				});

				var cpuGroup = d3.nest().key(function(d) {
					return d.group;
				})
				.map(allCpu,d3.map);

				var diskGroup = d3.nest().key(function(d) {
					return d.group;
				})
				.map(allDisk,d3.map);

				var networkGroup = d3.nest().key(function(d) {
					return d.group;
				})
				.map(allNetwork,d3.map);

				$(".chooseLineGroup").each(function() {
					if(!$(this).prop("checked")) {
						if($(this).val() == "cpu") {
							cpuGroup.remove("cpu");
						}
						if($(this).val() == "Disk_R") {
							diskGroup.remove("Disk_R");
						}
						if($(this).val() == "Disk_W") {
							diskGroup.remove("Disk_W");
						}
						if($(this).val() == "Net_R") {
							networkGroup.remove("Net_R");
						}
						if($(this).val() == "Net_W") {
							networkGroup.remove("Net_W");
						}

			    	}

				});
				
				chart.updateLines(d3.merge(cpuGroup.values()), 'cpu');
				chart.updateLines(d3.merge(diskGroup.values()), 'disk');
				chart.updateLines(d3.merge(networkGroup.values()), 'network');
			});
    	},

    	start: function() {
    		

			d3.json("test.json", function(error, data) {
    			if (error) throw error;
    			
    			chart.initGlobalOptions(data);

				var m = d3.map(data, function(d) {
    					return d.name;
    				});

				chart.init(m);

			});
    	}
    };

    chart.start();

})();