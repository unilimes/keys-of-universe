<?php

class Figure
{
    private $filepath;

    function __construct($filepath = '../model/')
    {
        $this->filepath = $filepath;
    }

    function saveFigureData($data, $type, $name)
    {
        if (!empty($data) &&  !empty($name)) {
            $data = json_encode($data);
            if ($type == 'objOfScene') {
                $fp = fopen($this->filepath . "figures/" . $name . ".json", "w");
            } else {
                $fp = fopen($this->filepath . "listOfKeys.json", "w");
            }
            if ($fp) {
                fwrite($fp, $data);
                fclose($fp);
            } else {
                return array("error" => "couldn't save data in file");
            }
            return array("success" => "saving " . $type . " done");
        } else {
            return array("error" => "couldn't save empty data");
        }
    }

    function getByNames($names)
    {
        if (!empty($names)) {
            $fileName =$this->filepath . "figures/Figure_" . $names.".json";
            if(file_exists($fileName)){
                $fp = fopen($fileName, "r");
                if ($fp) {
                    return array("data" =>  fread($fp,filesize($fileName)));
                }
            }else{
                return array("error" => "couldn't get data " . $names);
            }
        }
        return array("error" => "filename is not exist" . $names);
    }
}