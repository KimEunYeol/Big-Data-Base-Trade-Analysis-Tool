<?
/*
// Load XML file
$xml = new DOMDocument;
$xml->load('test.xml');

// Load XSL file
$xsl = new DOMDocument;
$xsl->load('simple.xsl');

// Configure the transformer
$proc = new XSLTProcessor;

// Attach the xsl rules
$proc->importStyleSheet($xsl);

echo $proc->transformToXML($xml);
*/

{
for $x in doc("test.xml")/breakfast_menu/food/name
order by $x
return <li>{$x}</li>
}
?>
