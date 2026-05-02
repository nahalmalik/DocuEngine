<?php
// api/utils/Router.php

class Router {
    private $routes = [];

    public function add($method, $path, $handler) {
        // Convert path with params like {id} to regex
        $regex = preg_replace('/\{([a-zA-Z0-9_]+)\}/', '(?P<\1>[a-zA-Z0-9_-]+)', $path);
        $regex = '#^' . $regex . '$#';
        
        $this->routes[] = [
            'method' => strtoupper($method),
            'regex' => $regex,
            'handler' => $handler
        ];
    }

    public function get($path, $handler) { $this->add('GET', $path, $handler); }
    public function post($path, $handler) { $this->add('POST', $path, $handler); }
    public function put($path, $handler) { $this->add('PUT', $path, $handler); }
    public function delete($path, $handler) { $this->add('DELETE', $path, $handler); }

    public function dispatch($method, $uri) {
        // Handle CORS preflight
        if ($method === 'OPTIONS') {
            header('Access-Control-Allow-Origin: *');
            header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
            header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
            http_response_code(200);
            exit;
        }

        // Parse URI
        $parsedUrl = parse_url($uri);
        $path = $parsedUrl['path'];
        
        // Remove base path from uri (e.g. /api/v1/something -> /v1/something)
        // This makes router environment-agnostic
        $baseApiFolder = '/api';
        if (strpos($path, $baseApiFolder) !== false) {
            $path = substr($path, strpos($path, $baseApiFolder) + strlen($baseApiFolder));
        }
        
        if (empty($path)) {
            $path = '/';
        }

        foreach ($this->routes as $route) {
            if ($route['method'] === $method && preg_match($route['regex'], $path, $matches)) {
                // Filter string keys (params)
                $params = array_filter($matches, 'is_string', ARRAY_FILTER_USE_KEY);
                
                // Call handler (Controller@method)
                list($controllerClass, $methodName) = explode('@', $route['handler']);
                
                // Include controller file if exists
                $controllerFile = __DIR__ . '/../controllers/' . $controllerClass . '.php';
                if (file_exists($controllerFile)) {
                    require_once $controllerFile;
                    $controller = new $controllerClass();
                    if (method_exists($controller, $methodName)) {
                        call_user_func_array([$controller, $methodName], array_values($params));
                        return;
                    }
                }
            }
        }

        // Not Found
        Response::error('Endpoint not found', 404);
    }
}
