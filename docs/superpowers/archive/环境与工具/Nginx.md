# Nginx
> 常用 location 匹配规则、重定向、缓存、反向代理与 history 路由配置。

## 匹配规则

- `=` 表示精确匹配。
- `~` 为区分大小写的匹配。
- `~*` 不区分大小写的匹配。
- `!~` 和 `!~*` 意为“不匹配的”。
- `^~` 标识符后面跟一个字符串，Nginx 将在这个字符串匹配后停止进行正则表达式的匹配。

## 重定向

```nginx
location / {
    root   html;
    rewrite ^/$ /h5/common/ redirect;
}

location /h5 {
    root   html;
    rewrite ^/h5 /h5/common/ redirect;
}
```

## 去除 HTML 文件缓存

```nginx
location ~* /h5/(\w+)/ {
    if ( $request_uri ~* /h5/(\w+)/$) {
        add_header Cache-Control "no-cache, no-store";
    }
}
```

## 请求代理

```nginx
location ^~ /proxy {
    proxy_pass http://test.51k1k.com/;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Real-Port $remote_port;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```

## 路由 history 模式

```nginx
location ~* /(\w+)/ {
    root   html;
    index  /$1/index.html;
    try_files $uri $uri/ /$1/index.html;
}
```

> 服务器上的部署配置见 [服务器配置](/90-附录/环境与工具/服务器配置)。
