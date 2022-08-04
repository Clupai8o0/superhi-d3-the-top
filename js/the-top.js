const svg = d3.select("svg");

// difference
data = data.map((d) => {
	d.difference = d.imdb - d.metascore;
	return d;
});

svg.attr("height", 40 * data.length).attr("width", "100%");

const scoreScale = d3.scaleLinear().domain([0, 100]).range([420, 900]);

const area = d3
	.area()
	.x0((d) => scoreScale(d.imdb))
	.x1((d) => scoreScale(d.metascore))
	.y0((_, i) => 40 * i + 20)
	.y1((_, i) => 40 * i + 20)
	.curve(d3.curveCardinal.tension(0.5));

const areaPath = svg
	.append("path")
	.datum(data)
	.attr("d", area)
	.attr("class", "area");

const imdbLine = d3
	.line()
	.x((d) => scoreScale(d.imdb))
	.y((_, i) => 40 * i + 20)
	.curve(d3.curveCardinal.tension(0.5));
const imdbPath = svg
	.append("path")
	.datum(data)
	.attr("d", imdbLine)
	.attr("class", "imdb");

const metascoreLine = d3
	.line()
	.x((d) => scoreScale(d.metascore))
	.y((_, i) => 40 * i + 20)
	.curve(d3.curveCardinal.tension(0.25));
const metascorePath = svg
	.append("path")
	.datum(data)
	.attr("d", metascoreLine)
	.attr("class", "metascore");

const groups = svg
	.selectAll("g.movie")
	.data(data)
	.enter()
	.append("g")
	.attr("class", "movie")
	.attr("transform", (_, i) => `translate(0, ${i * 40})`);

groups
	.append("rect")
	.attr("x", 0)
	.attr("y", 0)
	.attr("width", 960)
	.attr("height", 40)
	.attr("class", "background");

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

groups
	.append("circle")
	.attr("cx", (d) => scoreScale(d.metascore))
	.attr("cy", 20)
	.attr("r", 8)
	.attr("class", "metascore");

groups
	.append("circle")
	.attr("cx", (d) => scoreScale(d.imdb))
	.attr("cy", 20)
	.attr("r", 8)
	.attr("class", "imdb");

groups
	.append("text")
	.attr("x", (d) => {
		if (d.difference > 0) {
			return scoreScale(d.imdb) + 15;
		} else {
			return scoreScale(d.imdb) - 15;
		}
	})
	.attr("y", 20)
	.text((d) => d.imdb)
	.attr("class", "imdb")
	.style("text-anchor", (d) => {
		if (d.difference > 0) return "start";
		else return "end";
	});

groups
	.append("text")
	.attr("x", (d) => {
		if (d.difference > 0) {
			return scoreScale(d.metascore) - 15;
		} else {
			return scoreScale(d.metascore) + 15;
		}
	})
	.attr("y", 20)
	.text((d) => d.metascore)
	.attr("class", "metascore")
	.style("text-anchor", (d) => {
		if (d.difference > 0) return "end";
		else return "start";
	});

const selectTag = document.querySelector("select");
selectTag.addEventListener("change", (event) => {
	data.sort((a, b) => {
		if (event.target.value === "imdb") {
			return d3.descending(a.imdb, b.imdb);
		} else if (event.target.value === "year") {
			return d3.ascending(a.year, b.year);
		} else if (event.target.value === "title") {
			return d3.ascending(a.title, b.title);
		} else if (event.target.value === "difference") {
			return d3.descending(a.difference, b.difference);
		} else {
			return d3.descending(a.metascore, b.metascore);
		}
	});

	groups
		.data(data, (d) => d.title)
		.transition()
		.duration(1000)
		.attr("transform", (_, i) => `translate(0, ${i * 40})`);

	imdbPath
		.datum(data, (d) => d.title)
		.transition()
		.duration(1000)
		.attr("d", imdbLine);
	metascorePath
		.datum(data, (d) => d.title)
		.transition()
		.duration(1000)
		.attr("d", metascoreLine);

	areaPath
		.datum(data, (d) => d.title)
		.transition()
		.duration(1000)
		.attr("d", area);
});

const resize = () => {
	const svgTag = document.querySelector("svg");
	const svgWidth = svgTag.clientWidth;

	scoreScale.range([(420 / 960) * svgWidth, 900]);
	groups
		.selectAll("circle.metascore")
		.attr("cx", (d) => scoreScale(d.metascore));
	groups.selectAll("circle.imdb").attr("cx", (d) => scoreScale(d.imdb));
	groups.selectAll("text.title").attr("x", svgWidth >= 960 ? 90 : 70);
  metascoreLine.x(d => scoreScale(d.metascore));
  imdbLine.x((d) => scoreScale(d.imdb));
  metascorePath.attr("d", metascoreLine);
  imdbPath.attr("d", imdbLine);
};

resize();
window.addEventListener("resize", () => {
	resize();
});
