package com.app.controller;

import com.app.model.Workspace;
import com.app.repository.WorkspaceRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/workspaces")
@RequiredArgsConstructor
@Tag(name = "Места", description = "Управление рабочими местами")
public class WorkspaceController {

    private final WorkspaceRepository workspaceRepository;

    @Operation(summary = "Получить все места")
    @GetMapping
    public List<Workspace> getAllWorkspaces() {
        return workspaceRepository.findAll();
    }

    @Operation(summary = "Получить место по ID")
    @GetMapping("/{id}")
    public ResponseEntity<Workspace> getWorkspaceById(@PathVariable Long id) {
        Optional<Workspace> workspaceOpt = workspaceRepository.findById(id);
        return workspaceOpt.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Operation(summary = "Создать новое место")
    @PostMapping
    public ResponseEntity<Workspace> createWorkspace(@RequestBody Workspace workspace) {
        return ResponseEntity.ok(workspaceRepository.save(workspace));
    }

    @Operation(summary = "Удалить место по ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkspace(@PathVariable Long id) {
        if (!workspaceRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        workspaceRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
