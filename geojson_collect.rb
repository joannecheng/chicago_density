require 'json'
require 'pg'

conn = PG.connect :dbname => 'my_spatial_db'
geojson = { "type" => "FeatureCollection", :features => [] }
conn.exec("select st_asgeojson(geom), (cook_census_data.p001001/st_area(geom)) as density from cook_census_tracts LEFT JOIN cook_census_data on cook_census_tracts.geoid10 = cook_census_data.geoid where cook_census_data.p001001 > 0").each do |row|
  feature = { :type => "Feature", :geometry => JSON.parse(row['st_asgeojson']), :properties => { :density => row['density'].to_f }}
  geojson[:features] << feature
end

puts geojson.to_json

