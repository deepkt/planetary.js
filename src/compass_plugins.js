  planetaryjs.plugins.mentions = function(config) {
    var countries = {};
    var mentions = [];
    config = config || {};
    var file = config.file || 'world-topo.json';

    // Load country JSON topo
    // d3.json(file, function(err, data) {
    //   if (err) {
    //     throw new Error("Could not load " + file);
    //   }
    //   var geometries = data.objects.countries.geometries;
    //
    //   for(var i=0; i<geometries.length; i++){
    //     countries[geometries[i].properties.countryCode] = {
    //       name:geometries[i].properties.name,
    //       lat:geometries[i].properties.lat,
    //       lon:geometries[i].properties.lon
    //     };
    //   }
    // });

    var updateData = function(data, options) {
      // if(!countries) return;
      options = options || {};
      options.color = options.color || config.color || 'white';
      mentions = data;
    };

    var drawMentions = function(planet, context) {
      for (var i = 0; i < mentions.length; i++) {
        // drawMentionGraph(planet, context, mentions[i]);
      }
      drawMentionGraph(planet, context, mentions[0]);
    };

    var drawMentionGraph = function(planet, context, mention) {
      var alpha = 1;
      var color = d3.rgb('yellow');
      color = "rgba(" + color.r + "," + color.g + "," + color.b + "," + alpha + ")";
      // var country = countries[mention.country];
      // var circle = d3.geo.circle().origin([country.lon, country.lat]).angle(0.6)();
      // var circle = d3.geo.circle().origin(['28.6','77.2']).angle(2.2)();
      var circle = d3.geo.circle().origin([77.2, 28.6])
        .angle(1 / 2000 * 7)();
      context.beginPath();
      planet.path.context(context)(circle);
      context.stroke();
    };

    return function (planet) {
      planet.plugins.mentions = {
        update: updateData
      };

      planet.onDraw(function() {
        planet.withSavedContext(function(context) {
          drawMentionGraph(planet, context);
        });
      });
    };
  };
