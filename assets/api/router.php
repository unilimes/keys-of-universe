<?php
//header("Content-Type: application/json");

require_once(__DIR__ . "/Figure.php");

global $config;
$request = (object)$_REQUEST;
$post = json_decode(file_get_contents("php://input"));
$get = (object)$_GET;

if (!empty($request->method) || !empty($post->method)) {
    $fgr = new Figure();
    $method = empty($request->method) ? $post->method : $request->method;
    switch ($method) {
        case "saveF":
            $data = $fgr->saveFigureData($request->data,$request->type ,$request->name);
            die(json_encode($data));
            break;
        case "getByName":
            $data = $fgr->getByNames($request->fileName);
            die(json_encode($data));
            break;
        default:
            die(json_encode(array(
                'error' => "false request"
            )));
            break;
    }
}else{
    die(json_encode(array(
        'error' => "Empty request method!"
    )));
}
