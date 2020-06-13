主要可用函数：
均在multiTimesFuncs中

1. updateCountryOrProvinceStats(which)
用于更新国家/省的统计数据，which可选'country' or 'province'

2. updateCountryOrProvinceDaily(which)
用于更新国家/省的累计数据，which同上

3. updateSpecific(which,name)
用于更新某个省/国家的数据，which同上，
name为国家名或省名称简写(不是全称！),可以通过lib.provinceList/lib.countryList获得名称列表

4. updateCities(province)
用于更新城市名，province是省简称（同上），也可以是'all'，代表更新所有城市数据

