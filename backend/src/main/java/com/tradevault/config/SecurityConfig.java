@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

    http
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .csrf(AbstractHttpConfigurer::disable)

        .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        )

        .authorizeHttpRequests(auth -> auth

                // VERY IMPORTANT → allow preflight requests
                .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()

                // Public endpoints
                .requestMatchers("/home").permitAll()
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers("/stocks/search/**").permitAll()
                .requestMatchers("/leaderboard").permitAll()
                .requestMatchers("/favicon.ico").permitAll()

                // All other endpoints require authentication
                .anyRequest().authenticated()
        )

        .authenticationProvider(authenticationProvider())

        .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
        );

    return http.build();
}