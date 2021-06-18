require "fileutils" # For copying files etc

# ["20210617", "20210618", "20210511", "20210428", "20210427", "20210609"]
date_strs = Dir.entries("forecasts").grep(/\d{8}/)

nice_dates_strs = []

date_strs.each do |date_str| # "20210617"
  year_str  = date_str[0...4] # "2021"
  month_str = date_str[4...6] # "06"
  day_str   = date_str[6...8] # "17"

  # Convert to integers
  year  = year_str.to_i  # 2021
  month = month_str.to_i # 6
  day   = day_str.to_i   # 17

  nice_date_str = "#{year}-#{month}-#{day}" # "2021-6-17"
  nice_dates_strs += [nice_date_str]

  forecast_date_dir = File.join("forecasts", date_str) # "forecasts/20210617"
  out_dir           = File.join("site", nice_date_str) # "site/2021-6-17"

  # Make directories if they don't exist yet.
  FileUtils.mkdir_p(out_dir)

  # e.g. ["t6z", "t0z", "t12z", "t18z"]
  run_hour_strs = Dir.entries(forecast_date_dir).grep(/t\d+z/)

  # [0, 6, 12, 18]
  run_hours = run_hour_strs.map { |str| str[/\d+/].to_i }.sort

  # Use a templating library. For this demo I'll just use string interpolation.

  out = ""
  out += "<html>\n"
  out += "<head><title>Nadocast #{nice_date_str}</title></head>\n"
  out += "<body>\n"
  out += "<h1>Nadocast #{nice_date_str}</h1>\n"

  run_hours.each do |run_hour|
    run_hour_dir = File.join(forecast_date_dir, "t#{run_hour}z") # "forecasts/20210617/t0z"

    out += "<h2>#{run_hour}Z Forecasts</h2>\n"

    # ["nadocast_conus_tor_20210617_t00z_f02-11.png", "nadocast_conus_tor_20210617_t00z_f02.png", "nadocast_conus_tor_20210617_t00z_f03.png", ...]
    png_names    = Dir.entries(run_hour_dir).grep(/\.png\z/i).sort
    png_names.each do |png_name|
      png_path     = File.join(run_hour_dir, png_name) # "forecasts/20210617/t0z/nadocast_conus_tor_20210617_t00z_f02-11.png"
      png_out_path = File.join(out_dir, png_name)      # "site/2021-6-17/nadocast_conus_tor_20210617_t00z_f02-11.png"

      FileUtils.cp(png_path, png_out_path) # This is slow for some unknown reason.
      out += "<img src=\"#{png_name}\">\n"
    end
  end

  out += "</body>\n"
  out += "</html>\n"

  puts out

  File.write(File.join(out_dir, "index.html"), out)
end

# Generate landing page.

out = ""
out += "<html>\n"
out += "<head><title>Nadocast</title></head>\n"
out += "<body>\n"
out += "<h1>Nadocast</h1>\n"

out += "<p>Eventually the latest forecast will go here.</p>\n"

nice_dates_strs.each do |nice_date_str|
  out += "<p><a href=\"#{nice_date_str}/index.html\">#{nice_date_str}</a></p>\n"
end

out += "</body>\n"
out += "</html>\n"

puts out

File.write(File.join("site", "index.html"), out)
