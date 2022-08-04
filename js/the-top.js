const svg = d3.select("svg");
svg.attr("height", 40 * data.length);

const groups = svg
	.selectAll("g.movie")
	.data(data)
	.enter()
	.append("g")
	.attr("class", "movie")
	.attr("transform", (_, i) => `translate(0, ${i * 40})`);

groups.append("text").text((d) => d.title);
