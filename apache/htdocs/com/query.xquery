{
for $x in doc("test.xml")/breakfast_menu/food/name
order by $x
return <li>{$x}</li>
}
