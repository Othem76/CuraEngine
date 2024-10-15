rm output.gcode

./CuraEngine slice -j /ressources/definitions/ultimaker_s5.def.json -s roofing_layer_count=3 -s support_enable=true -s support_density=20 -s support_z_seam_away_from_model=true -s layer_height=0.2 -s infill_density=20 -s material_type=PLA -l /opt/CuraEngine/model.stl -o output.gcode
