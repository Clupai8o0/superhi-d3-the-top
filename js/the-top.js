const svg = d3.select("svg");

svg.attr("height", 40 * data.length).attr("width", 960);

const groups = svg
	.selectAll("g.movie")
	.data(data)
	.enter()
	.append("g")
	.attr("class", "movie")
	.attr("transform", (_, i) => `translate(0, ${i * 40})`);

groups
	.append("text")
	.attr("x", 90)
	.attr("y", 20)
	.attr("class", "title")
	.text((d) => d.title);

groups
	.append("text")
	.attr("x", 24)
	.attr("y", 20)
  .attr("class", "year")
	.text((d) => d.year);
